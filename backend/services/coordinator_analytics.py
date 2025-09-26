from typing import Dict, List, Optional
import statistics
from datetime import datetime, timedelta
from .classroom import GoogleClassroomService

class CoordinatorAnalyticsService:
    def __init__(self, classroom_service: GoogleClassroomService):
        self.classroom_service = classroom_service
    
    def get_comprehensive_analytics(self) -> Dict:
        """Get all analytics data for coordinator dashboard"""
        try:
            # Get base data
            all_courses = self.classroom_service.get_all_domain_courses()
            
            # Calculate metrics
            institution_overview = self._get_institution_overview(all_courses)
            course_metrics = self._get_course_performance_metrics(all_courses)
            teacher_metrics = self._get_teacher_effectiveness_metrics(all_courses)
            alerts = self._identify_alerts(course_metrics, teacher_metrics)
            
            return {
                "institution_overview": institution_overview,
                "course_metrics": course_metrics,
                "teacher_metrics": teacher_metrics,
                "alerts": alerts,
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting coordinator analytics: {e}")
            return {}
    
    def _get_institution_overview(self, courses: List[Dict]) -> Dict:
        """Calculate high-level institution metrics"""
        active_courses = [c for c in courses if c.get('courseState') == 'ACTIVE']
        
        # Get all teachers across courses
        all_teachers = set()
        total_students = 0
        
        for course in active_courses:
            course_id = course.get('id')
            if course_id:
                teachers = self.classroom_service.get_teachers(course_id)
                for teacher in teachers:
                    all_teachers.add(teacher.get('profile', {}).get('emailAddress', ''))
                
                students = self.classroom_service.get_students(course_id)
                total_students += len(students)
        
        return {
            "total_courses": len(courses),
            "active_courses": len(active_courses),
            "total_teachers": len(all_teachers),
            "total_students": total_students,
            "courses_per_teacher": round(len(active_courses) / max(len(all_teachers), 1), 2),
            "students_per_course": round(total_students / max(len(active_courses), 1), 2)
        }
    
    def _get_course_performance_metrics(self, courses: List[Dict]) -> List[Dict]:
        """Analyze performance metrics for each course"""
        course_metrics = []
        
        for course in courses:
            if course.get('courseState') != 'ACTIVE':
                continue
                
            course_id = course.get('id')
            if not course_id:
                continue
            
            try:
                # Get course data
                students = self.classroom_service.get_students(course_id)
                teachers = self.classroom_service.get_teachers(course_id)
                coursework = self.classroom_service.get_coursework(course_id)
                announcements = self.classroom_service.get_announcements(course_id)
                materials = self.classroom_service.get_course_work_materials(course_id)
                
                # Calculate metrics
                metrics = self._calculate_course_metrics(
                    course, students, teachers, coursework, announcements, materials
                )
                course_metrics.append(metrics)
                
            except Exception as e:
                print(f"Error calculating metrics for course {course_id}: {e}")
                continue
        
        return course_metrics
    
    def _calculate_course_metrics(self, course: Dict, students: List[Dict], 
                                teachers: List[Dict], coursework: List[Dict],
                                announcements: List[Dict], materials: List[Dict]) -> Dict:
        """Calculate detailed metrics for a single course"""
        course_id = course.get('id')
        
        # Basic info
        primary_teacher = teachers[0] if teachers else {}
        teacher_name = primary_teacher.get('profile', {}).get('name', {}).get('fullName', 'Unknown')
        
        # Submission analysis
        all_grades = []
        total_submissions = 0
        on_time_submissions = 0
        late_submissions = 0
        
        for assignment in coursework:
            assignment_id = assignment.get('id')
            if assignment_id:
                submissions = self.classroom_service.get_student_submissions(course_id, assignment_id)
                for submission in submissions:
                    total_submissions += 1
                    
                    # Check if graded
                    if submission.get('assignedGrade'):
                        grade = float(submission.get('assignedGrade', 0))
                        max_points = float(assignment.get('maxPoints', 100))
                        if max_points > 0:
                            percentage = (grade / max_points) * 100
                            all_grades.append(percentage)
                    
                    # Check timing
                    due_date = assignment.get('dueDate')
                    submission_time = submission.get('updateTime')
                    if due_date and submission_time:
                        # Simplified timing check (would need proper date parsing)
                        if submission.get('late', False):
                            late_submissions += 1
                        else:
                            on_time_submissions += 1
        
        # Calculate averages
        average_grade = statistics.mean(all_grades) if all_grades else 0
        submission_rate = (total_submissions / max(len(students) * len(coursework), 1)) * 100
        on_time_rate = (on_time_submissions / max(total_submissions, 1)) * 100
        
        # Activity metrics
        recent_announcements = len([a for a in announcements if self._is_recent(a.get('creationTime'))])
        
        # Risk assessment
        risk_level = self._assess_course_risk(average_grade, submission_rate, on_time_rate, recent_announcements)
        issues = self._identify_course_issues(average_grade, submission_rate, on_time_rate, recent_announcements)
        
        return {
            "course_id": course_id,
            "course_name": course.get('name', 'Unknown'),
            "teacher_name": teacher_name,
            "teacher_email": primary_teacher.get('profile', {}).get('emailAddress', ''),
            "student_count": len(students),
            "assignment_count": len(coursework),
            "material_count": len(materials),
            
            # Performance metrics
            "average_grade": round(average_grade, 2),
            "submission_rate": round(submission_rate, 2),
            "on_time_rate": round(on_time_rate, 2),
            "late_rate": round((late_submissions / max(total_submissions, 1)) * 100, 2),
            
            # Activity metrics
            "announcements_count": len(announcements),
            "recent_announcements": recent_announcements,
            "materials_shared": len(materials),
            
            # Assessment
            "risk_level": risk_level,
            "issues": issues,
            "last_activity": course.get('updateTime', ''),
            
            # Grade distribution
            "grade_distribution": self._calculate_grade_distribution(all_grades)
        }
    
    def _get_teacher_effectiveness_metrics(self, courses: List[Dict]) -> List[Dict]:
        """Analyze teacher effectiveness across their courses"""
        teacher_data = {}
        
        # Aggregate data by teacher
        for course in courses:
            if course.get('courseState') != 'ACTIVE':
                continue
                
            course_id = course.get('id')
            if not course_id:
                continue
            
            try:
                teachers = self.classroom_service.get_teachers(course_id)
                students = self.classroom_service.get_students(course_id)
                coursework = self.classroom_service.get_coursework(course_id)
                
                for teacher in teachers:
                    email = teacher.get('profile', {}).get('emailAddress', '')
                    if not email:
                        continue
                    
                    if email not in teacher_data:
                        teacher_data[email] = {
                            "teacher_name": teacher.get('profile', {}).get('name', {}).get('fullName', 'Unknown'),
                            "teacher_email": email,
                            "courses": [],
                            "total_students": 0,
                            "total_assignments": 0,
                            "all_grades": []
                        }
                    
                    teacher_data[email]["courses"].append(course.get('name', 'Unknown'))
                    teacher_data[email]["total_students"] += len(students)
                    teacher_data[email]["total_assignments"] += len(coursework)
                    
                    # Collect grades for this teacher's course
                    for assignment in coursework:
                        assignment_id = assignment.get('id')
                        if assignment_id:
                            submissions = self.classroom_service.get_student_submissions(course_id, assignment_id)
                            for submission in submissions:
                                if submission.get('assignedGrade'):
                                    grade = float(submission.get('assignedGrade', 0))
                                    max_points = float(assignment.get('maxPoints', 100))
                                    if max_points > 0:
                                        percentage = (grade / max_points) * 100
                                        teacher_data[email]["all_grades"].append(percentage)
                        
            except Exception as e:
                print(f"Error processing teacher data for course {course_id}: {e}")
                continue
        
        # Calculate teacher metrics
        teacher_metrics = []
        for email, data in teacher_data.items():
            avg_performance = statistics.mean(data["all_grades"]) if data["all_grades"] else 0
            
            teacher_metrics.append({
                "teacher_name": data["teacher_name"],
                "teacher_email": email,
                "total_courses": len(data["courses"]),
                "course_names": data["courses"],
                "total_students": data["total_students"],
                "total_assignments": data["total_assignments"],
                "average_class_performance": round(avg_performance, 2),
                "students_per_course": round(data["total_students"] / max(len(data["courses"]), 1), 2),
                "assignments_per_course": round(data["total_assignments"] / max(len(data["courses"]), 1), 2),
                "workload_level": self._assess_teacher_workload(data["total_students"], len(data["courses"])),
                "performance_level": self._assess_teacher_performance(avg_performance)
            })
        
        return sorted(teacher_metrics, key=lambda x: x["average_class_performance"], reverse=True)
    
    def _identify_alerts(self, course_metrics: List[Dict], teacher_metrics: List[Dict]) -> List[Dict]:
        """Identify courses and teachers that need attention"""
        alerts = []
        
        # Course-based alerts
        for course in course_metrics:
            if course["risk_level"] == "high":
                alerts.append({
                    "type": "course_risk",
                    "severity": "high",
                    "title": f"High-risk course: {course['course_name']}",
                    "description": f"Average grade: {course['average_grade']}%, Submission rate: {course['submission_rate']}%",
                    "course_id": course["course_id"],
                    "teacher": course["teacher_name"],
                    "action_required": True
                })
            
            if course["submission_rate"] < 50:
                alerts.append({
                    "type": "low_engagement",
                    "severity": "medium",
                    "title": f"Low engagement in {course['course_name']}",
                    "description": f"Only {course['submission_rate']}% submission rate",
                    "course_id": course["course_id"],
                    "teacher": course["teacher_name"],
                    "action_required": True
                })
        
        # Teacher-based alerts
        for teacher in teacher_metrics:
            if teacher["workload_level"] == "overloaded":
                alerts.append({
                    "type": "teacher_overload",
                    "severity": "medium",
                    "title": f"Teacher overload: {teacher['teacher_name']}",
                    "description": f"{teacher['total_students']} students across {teacher['total_courses']} courses",
                    "teacher_email": teacher["teacher_email"],
                    "action_required": True
                })
            
            if teacher["average_class_performance"] < 60:
                alerts.append({
                    "type": "teacher_performance",
                    "severity": "high",
                    "title": f"Low performance across courses: {teacher['teacher_name']}",
                    "description": f"Average class performance: {teacher['average_class_performance']}%",
                    "teacher_email": teacher["teacher_email"],
                    "action_required": True
                })
        
        return sorted(alerts, key=lambda x: {"high": 3, "medium": 2, "low": 1}[x["severity"]], reverse=True)
    
    def _calculate_grade_distribution(self, grades: List[float]) -> Dict:
        """Calculate grade distribution"""
        if not grades:
            return {"excellent": 0, "good": 0, "regular": 0, "poor": 0}
        
        excellent = len([g for g in grades if g >= 90])
        good = len([g for g in grades if 70 <= g < 90])
        regular = len([g for g in grades if 50 <= g < 70])
        poor = len([g for g in grades if g < 50])
        
        total = len(grades)
        return {
            "excellent": round((excellent / total) * 100, 1),
            "good": round((good / total) * 100, 1),
            "regular": round((regular / total) * 100, 1),
            "poor": round((poor / total) * 100, 1)
        }
    
    def _assess_course_risk(self, avg_grade: float, submission_rate: float, 
                          on_time_rate: float, recent_activity: int) -> str:
        """Assess risk level for a course"""
        risk_score = 0
        
        if avg_grade < 60:
            risk_score += 3
        elif avg_grade < 70:
            risk_score += 2
        elif avg_grade < 80:
            risk_score += 1
        
        if submission_rate < 50:
            risk_score += 3
        elif submission_rate < 70:
            risk_score += 2
        elif submission_rate < 85:
            risk_score += 1
        
        if on_time_rate < 60:
            risk_score += 2
        elif on_time_rate < 80:
            risk_score += 1
        
        if recent_activity == 0:
            risk_score += 2
        
        if risk_score >= 6:
            return "high"
        elif risk_score >= 3:
            return "medium"
        else:
            return "low"
    
    def _identify_course_issues(self, avg_grade: float, submission_rate: float,
                              on_time_rate: float, recent_activity: int) -> List[str]:
        """Identify specific issues with a course"""
        issues = []
        
        if avg_grade < 60:
            issues.append("Very low average grades")
        elif avg_grade < 70:
            issues.append("Below average grades")
        
        if submission_rate < 50:
            issues.append("Very low submission rate")
        elif submission_rate < 70:
            issues.append("Low submission rate")
        
        if on_time_rate < 60:
            issues.append("High rate of late submissions")
        
        if recent_activity == 0:
            issues.append("No recent announcements")
        
        return issues
    
    def _assess_teacher_workload(self, total_students: int, total_courses: int) -> str:
        """Assess teacher workload level"""
        if total_students > 150 or total_courses > 6:
            return "overloaded"
        elif total_students > 100 or total_courses > 4:
            return "high"
        elif total_students > 50 or total_courses > 2:
            return "moderate"
        else:
            return "light"
    
    def _assess_teacher_performance(self, avg_performance: float) -> str:
        """Assess teacher performance level"""
        if avg_performance >= 85:
            return "excellent"
        elif avg_performance >= 75:
            return "good"
        elif avg_performance >= 65:
            return "average"
        else:
            return "needs_improvement"
    
    def _is_recent(self, timestamp: str, days: int = 30) -> bool:
        """Check if timestamp is within recent days"""
        if not timestamp:
            return False
        
        try:
            # Simplified date check - would need proper parsing
            return True  # Placeholder
        except:
            return False
