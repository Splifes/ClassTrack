import requests
import statistics
from datetime import datetime
from typing import Dict, List, Optional

class GoogleClassroomService:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://classroom.googleapis.com/v1'
        self.headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
    
    def get_courses(self, student_id: str = 'me') -> List[Dict]:
        """Get all courses for a specific student ('me' by default)."""
        try:
            params = {'studentId': student_id}
            response = requests.get(f'{self.base_url}/courses', headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get('courses', [])
        except requests.RequestException as e:
            print(f"Error fetching courses: {e}")
            return []

    def get_all_domain_courses(self) -> List[Dict]:
        """Get all courses in the domain (requires admin privileges)."""
        try:
            # This endpoint typically requires admin-level permissions and scopes
            response = requests.get(f'{self.base_url}/courses', headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get('courses', [])
        except requests.RequestException as e:
            print(f"Error fetching all domain courses: {e}")
            return []

    def get_teaching_courses(self) -> List[Dict]:
        """Get all courses taught by the authenticated user."""
        try:
            params = {'teacherId': 'me'}
            response = requests.get(f'{self.base_url}/courses', headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get('courses', [])
        except requests.RequestException as e:
            print(f"Error fetching teaching courses: {e}")
            return []
    
    def get_course(self, course_id: str) -> Optional[Dict]:
        """Get specific course details"""
        try:
            response = requests.get(f'{self.base_url}/courses/{course_id}', headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching course {course_id}: {e}")
            return None
    
    def get_students(self, course_id: str) -> List[Dict]:
        """Get all students enrolled in a course, handling pagination."""
        all_students = []
        page_token = None
        try:
            while True:
                params = {}
                if page_token:
                    params['pageToken'] = page_token
                
                response = requests.get(f'{self.base_url}/courses/{course_id}/students', headers=self.headers, params=params)
                response.raise_for_status()
                data = response.json()
                
                all_students.extend(data.get('students', []))
                
                page_token = data.get('nextPageToken')
                if not page_token:
                    break
            return all_students
        except requests.RequestException as e:
            print(f"Error fetching students for course {course_id}: {e}")
            return []
    
    def get_all_students_from_all_courses(self) -> List[Dict]:
        """Get a unique list of all students from all accessible courses."""
        all_students = {}
        
        # Combine teaching courses and all domain courses for coordinators
        try:
            teaching_courses = self.get_teaching_courses()
        except Exception:
            teaching_courses = []

        try:
            # Assuming coordinators might need to see all domain courses
            # This might require admin privileges
            domain_courses = self.get_all_domain_courses()
        except Exception:
            domain_courses = []

        # Create a unique set of courses by ID
        all_courses = {course['id']: course for course in teaching_courses + domain_courses}.values()

        for course in all_courses:
            try:
                students_in_course = self.get_students(course['id'])
                for student in students_in_course:
                    # Use student's user ID as the key to avoid duplicates
                    if student['userId'] not in all_students:
                        student['courseName'] = course.get('name', 'N/A')
                        all_students[student['userId']] = student
            except Exception as e:
                print(f"Could not fetch students for course {course['id']}: {e}")
                continue
        
        return list(all_students.values())

    def get_teachers(self, course_id: str) -> List[Dict]:
        """Get teachers for a course"""
        try:
            response = requests.get(f'{self.base_url}/courses/{course_id}/teachers', headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get('teachers', [])
        except requests.RequestException as e:
            print(f"Error fetching teachers for course {course_id}: {e}")
            return []
    
    def get_coursework(self, course_id: str) -> List[Dict]:
        """Get coursework (assignments) for a course"""
        try:
            response = requests.get(f'{self.base_url}/courses/{course_id}/courseWork', headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get('courseWork', [])
        except requests.RequestException as e:
            print(f"Error fetching coursework for course {course_id}: {e}")
            return []
    
    def get_student_submissions(self, course_id: str, coursework_id: str):
        """Get student submissions for a specific coursework"""
        try:
            url = f"{self.base_url}/courses/{course_id}/courseWork/{coursework_id}/studentSubmissions"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('studentSubmissions', [])
        except requests.RequestException as e:
            print(f"Error fetching submissions for coursework {coursework_id}: {e}")
            return []
    
    def get_course_work_materials(self, course_id: str):
        """Get course work materials (resources, documents, etc.)"""
        try:
            url = f"{self.base_url}/courses/{course_id}/courseWorkMaterials"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('courseWorkMaterial', [])
        except requests.RequestException as e:
            print(f"Error fetching course work materials for course {course_id}: {e}")
            return []
    
    def get_announcements(self, course_id: str):
        """Get course announcements"""
        try:
            url = f"{self.base_url}/courses/{course_id}/announcements"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('announcements', [])
        except requests.RequestException as e:
            print(f"Error fetching announcements for course {course_id}: {e}")
            return []
    
    def get_topics(self, course_id: str):
        """Get course topics/categories"""
        try:
            url = f"{self.base_url}/courses/{course_id}/topics"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('topic', [])
        except requests.RequestException as e:
            print(f"Error fetching topics for course {course_id}: {e}")
            return []
    
    def get_course_aliases(self, course_id: str):
        """Get course aliases"""
        try:
            url = f"{self.base_url}/courses/{course_id}/aliases"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('aliases', [])
        except requests.RequestException as e:
            print(f"Error fetching aliases for course {course_id}: {e}")
            return []
    
    
    def get_grading_period_settings(self, course_id: str):
        """Get grading period settings for the course"""
        try:
            url = f"{self.base_url}/courses/{course_id}/gradingPeriodSettings"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching grading period settings for course {course_id}: {e}")
            return {}
    
    def get_course_work_rubrics(self, course_id: str, coursework_id: str):
        """Get rubrics for specific coursework"""
        try:
            url = f"{self.base_url}/courses/{course_id}/courseWork/{coursework_id}/rubrics"
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json().get('rubrics', [])
        except requests.RequestException as e:
            print(f"Error fetching rubrics for coursework {coursework_id}: {e}")
            return []

    def get_course_timeline(self, course_id: str, user: Optional[Dict] = None) -> List[Dict]:
        """Get a formatted timeline of course activities, adjusted for user role."""
        try:
            timeline_events = []
            
            # Role-based data fetching
            if user and user.get('role') == 'student':
                student_view = self.get_student_view_for_course(course_id, user)
                coursework = student_view.get('my_coursework', [])
                announcements = student_view.get('announcements', [])
                materials = self.get_course_work_materials(course_id) # Students can usually see materials
            else:
                # Default behavior for teachers/coordinators
                coursework = self.get_coursework(course_id)
                announcements = self.get_announcements(course_id)
                materials = self.get_course_work_materials(course_id)

            for work in coursework:
                timeline_events.append({
                    'id': work['id'],
                    'type': 'assignment',
                    'title': work.get('title', 'Untitled Assignment'),
                    'description': work.get('description', ''),
                    'date': work.get('creationTime', ''),
                    'status': 'published' if work.get('state') == 'PUBLISHED' else 'draft',
                    'metadata': {
                        'dueDate': work.get('dueDate'),
                        'dueTime': work.get('dueTime'),
                        'workType': work.get('workType', 'ASSIGNMENT')
                    }
                })
            
            for material in materials:
                timeline_events.append({
                    'id': material['id'],
                    'type': 'material',
                    'title': material.get('title', 'Untitled Material'),
                    'description': material.get('description', ''),
                    'date': material.get('creationTime', ''),
                    'status': 'published',
                    'metadata': {}
                })

            for announcement in announcements:
                timeline_events.append({
                    'id': announcement['id'],
                    'type': 'announcement',
                    'title': 'New Announcement',
                    'description': announcement.get('text', ''),
                    'date': announcement.get('creationTime', ''),
                    'status': 'published',
                    'metadata': {}
                })

            timeline_events.sort(key=lambda x: x['date'], reverse=True)
            return timeline_events
        except Exception as e:
            print(f"Error creating course timeline for {course_id}: {e}")
            return []

    def get_all_courses_stream(self) -> List[Dict]:
        """Fetches and combines the stream timeline for all user's courses."""
        try:
            courses = self.get_courses()
            all_stream_items = []

            for course in courses:
                course_id = course.get('id')
                if not course_id:
                    continue

                coursework = self.get_coursework(course_id)
                materials = self.get_course_work_materials(course_id)
                announcements = self.get_announcements(course_id)

                for item in coursework:
                    item['course_name'] = course.get('name')
                    item['type'] = 'coursework'
                    all_stream_items.append(item)
                
                for item in materials:
                    item['course_name'] = course.get('name')
                    item['type'] = 'material'
                    all_stream_items.append(item)

                for item in announcements:
                    item['course_name'] = course.get('name')
                    item['type'] = 'announcement'
                    all_stream_items.append(item)

            all_stream_items.sort(key=lambda x: x.get('creationTime', ''), reverse=True)
            return all_stream_items[:20]
        except Exception as e:
            print(f"Error creating all-courses stream: {e}")
            return []

    def get_student_course_insights(self, course_id: str, user_id: str) -> Dict:
        """Generate detailed analytics and insights for a specific student in a course."""
        insights = {
            "header_stats": {},
            "timeline": [],
            "assignments": [],
            "suggestions": []
        }

        try:
            coursework_list = self.get_coursework(course_id)
            if not coursework_list:
                return insights

            all_submissions = []
            for work in coursework_list:
                submissions = self.get_student_submissions(course_id, work['id'])
                for sub in submissions:
                    sub['courseWorkTitle'] = work.get('title', 'Untitled')
                    sub['courseWorkMaxPoints'] = work.get('maxPoints')
                    sub['dueDate'] = work.get('dueDate')
                all_submissions.extend(submissions)

            if not all_submissions:
                return insights

            # Filter submissions for the target student and the rest of the class
            student_submissions = [s for s in all_submissions if s.get('userId') == user_id]
            class_submissions = [s for s in all_submissions if s.get('userId') != user_id]

            # --- Calculations ---
            student_grades = [s.get('assignedGrade') for s in student_submissions if s.get('assignedGrade') is not None]
            class_grades = [s.get('assignedGrade') for s in class_submissions if s.get('assignedGrade') is not None]

            student_avg = statistics.mean(student_grades) if student_grades else 0
            class_avg = statistics.mean(class_grades) if class_grades else 0

            insights['header_stats'] = {
                'student_average': round(student_avg, 2),
                'class_average': round(class_avg, 2),
            }

            # Timeline
            timeline_points = []
            graded_submissions = sorted(
                [s for s in student_submissions if s.get('assignedGrade') is not None and 'updateTime' in s],
                key=lambda x: x['updateTime']
            )
            for sub in graded_submissions:
                timeline_points.append({
                    'date': sub['updateTime'],
                    'score': sub['assignedGrade'],
                    'title': sub.get('courseWorkTitle', 'N/A')
                })
            insights['timeline'] = timeline_points

            # Assignments Table
            assignments_table = []
            for work in coursework_list:
                submission = next((s for s in student_submissions if s.get('courseWorkId') == work.get('id')), None)
                due_date_obj = work.get('dueDate')
                due_date_str = f"{due_date_obj['year']}-{due_date_obj['month']}-{due_date_obj['day']}" if due_date_obj else None

                assignments_table.append({
                    'id': work['id'],
                    'title': work.get('title', 'N/A'),
                    'dueDate': due_date_str,
                    'state': submission.get('state', 'MISSING') if submission else 'MISSING',
                    'late': submission.get('late', False) if submission else False,
                    'grade': submission.get('assignedGrade') if submission else None,
                    'maxPoints': work.get('maxPoints')
                })
            insights['assignments'] = assignments_table

            # Suggestions
            suggestions = []
            late_count = len([s for s in assignments_table if s['late']])
            missing_count = len([s for s in assignments_table if s['state'] == 'MISSING'])

            if late_count > 2:
                suggestions.append(f"Tienes {late_count} entregas tardías. ¡Intenta planificar con más antelación!")
            if missing_count > 0:
                suggestions.append(f"Hay {missing_count} tareas sin entregar. ¡No te olvides de completarlas para mejorar tu promedio!")
            if student_avg > 0 and class_avg > 0 and student_avg < class_avg:
                suggestions.append("Tu promedio está un poco por debajo de la media de la clase. ¡Sigue esforzándote!")
            
            insights['suggestions'] = suggestions

        except Exception as e:
            print(f"Error generating student insights for course {course_id}: {e}")
            # Return partial or empty insights on error

        return insights

    def _calculate_course_analytics(self, data: Dict) -> Dict:
        """Calculate analytics from course data"""
        analytics = {
            "overview": {},
            "submissions": {},
            "students": {},
            "coursework": {},
            "engagement": {}
        }
        
        try:
            analytics["overview"] = {
                "total_students": len(data.get("students", [])),
                "total_teachers": len(data.get("teachers", [])),
                "total_coursework": len(data.get("coursework", [])),
                "total_submissions": len(data.get("submissions", [])),
                "course_state": data.get("course", {}).get("courseState", "UNKNOWN")
            }
            
            submissions = data.get("submissions", [])
            if submissions:
                total_submissions = len(submissions)
                turned_in = len([s for s in submissions if s.get("state") == "TURNED_IN"])
                late_submissions = len([s for s in submissions if s.get("late", False)])
                graded_submissions = len([s for s in submissions if s.get("assignedGrade") is not None])
                
                analytics["submissions"] = {
                    "total": total_submissions,
                    "turned_in": turned_in,
                    "late": late_submissions,
                    "graded": graded_submissions,
                    "turn_in_rate": (turned_in / total_submissions * 100) if total_submissions > 0 else 0,
                    "late_rate": (late_submissions / total_submissions * 100) if total_submissions > 0 else 0,
                    "grading_progress": (graded_submissions / total_submissions * 100) if total_submissions > 0 else 0
                }
                
                grades = [s.get("assignedGrade") for s in submissions if s.get("assignedGrade") is not None]
                if grades:
                    analytics["submissions"]["grade_stats"] = {
                        "average": sum(grades) / len(grades),
                        "min": min(grades),
                        "max": max(grades),
                        "count": len(grades)
                    }
            
            coursework = data.get("coursework", [])
            if coursework:
                published = len([c for c in coursework if c.get("state") == "PUBLISHED"])
                with_due_date = len([c for c in coursework if c.get("dueDate")])
                with_materials = len([c for c in coursework if c.get("materials")])
                
                analytics["coursework"] = {
                    "total": len(coursework),
                    "published": published,
                    "with_due_date": with_due_date,
                    "with_materials": with_materials,
                    "publish_rate": (published / len(coursework) * 100) if coursework else 0
                }
            
            students = data.get("students", [])
            if students and submissions:
                student_submission_counts = {}
                for submission in submissions:
                    user_id = submission.get("userId")
                    if user_id:
                        student_submission_counts[user_id] = student_submission_counts.get(user_id, 0) + 1
                
                if student_submission_counts:
                    avg_submissions = sum(student_submission_counts.values()) / len(student_submission_counts)
                    analytics["engagement"] = {
                        "average_submissions_per_student": avg_submissions,
                        "most_active_submissions": max(student_submission_counts.values()),
                        "least_active_submissions": min(student_submission_counts.values()),
                        "students_with_submissions": len(student_submission_counts),
                        "engagement_rate": (len(student_submission_counts) / len(students) * 100) if students else 0
                    }
        
        except Exception as e:
            print(f"Error in analytics calculation: {e}")
            analytics["error"] = str(e)
        
        return analytics

    def get_complete_course_data(self, course_id: str) -> Dict:
        """Get all available data for a course and calculate analytics."""
        complete_data = {
            "course": {},
            "coursework": [],
            "students": [],
            "teachers": [],
            "submissions": [],
            "announcements": [],
            "topics": [],
            "materials": [],
            "course_work_materials": [],
            "aliases": [],
            "grading_periods": {},
            "rubrics": {},
            "analytics": {}
        }

        try:
            complete_data["course"] = self.get_course(course_id)
        except Exception as e:
            print(f"Error fetching course: {e}")
        
        try:
            coursework = self.get_coursework(course_id)
            complete_data["coursework"] = coursework
            
            all_submissions = []
            for work in coursework:
                try:
                    submissions = self.get_student_submissions(course_id, work['id'])
                    for submission in submissions:
                        submission['courseWorkTitle'] = work.get('title', 'Untitled')
                        submission['courseWorkMaxPoints'] = work.get('maxPoints', 0)
                        all_submissions.extend([submission] if isinstance(submission, dict) else submissions)
                except Exception as e:
                    print(f"Error fetching submissions for {work['id']}: {e}")
                    continue
            
            complete_data["submissions"] = all_submissions
            
        except Exception as e:
            error_msg = str(e)
            print(f"Error fetching coursework for course {course_id}: {error_msg}")
            
            complete_data["coursework_error"] = {
                "message": error_msg,
                "course_id": course_id,
                "possible_causes": [
                    "Insufficient permissions - user may not be teacher/owner of this course",
                    "Course may be archived or in PROVISIONED state", 
                    "OAuth scope 'https://www.googleapis.com/auth/classroom.coursework.students.readonly' may be missing",
                    "User may only have student access to this course"
                ],
                "solutions": [
                    "Check if user is teacher/owner of the course",
                    "Verify course state is ACTIVE",
                    "Ensure proper OAuth scopes are granted",
                    "Try accessing as course owner"
                ]
            }
        
        try:
            complete_data["students"] = self.get_students(course_id)
        except Exception as e:
            print(f"Error fetching students: {e}")
        
        try:
            complete_data["teachers"] = self.get_teachers(course_id)
        except Exception as e:
            print(f"Error fetching teachers: {e}")
        
        try:
            complete_data["course_work_materials"] = self.get_course_work_materials(course_id)
        except Exception as e:
            print(f"Error fetching course work materials: {e}")
        
        try:
            complete_data["announcements"] = self.get_announcements(course_id)
        except Exception as e:
            print(f"Error fetching announcements: {e}")
        
        try:
            complete_data["topics"] = self.get_topics(course_id)
        except Exception as e:
            print(f"Error fetching topics: {e}")
        
        try:
            complete_data["aliases"] = self.get_course_aliases(course_id)
        except Exception as e:
            print(f"Error fetching course aliases: {e}")
        
        try:
            complete_data["grading_periods"] = self.get_grading_period_settings(course_id)
        except Exception as e:
            print(f"Error fetching grading periods: {e}")
        
        try:
            rubrics = {}
            for work in complete_data.get("coursework", []):
                work_id = work.get("id")
                if work_id:
                    rubrics[work_id] = self.get_course_work_rubrics(course_id, work_id)
            complete_data["rubrics"] = rubrics
        except Exception as e:
            print(f"Error fetching rubrics: {e}")
        
        try:
            stream_items = []
            
            for work in complete_data.get("coursework", []):
                stream_items.append({
                    "type": "coursework",
                    "id": work.get("id"),
                    "title": work.get("title"),
                    "description": work.get("description"),
                    "creationTime": work.get("creationTime"),
                    "updateTime": work.get("updateTime"),
                    "state": work.get("state"),
                    "maxPoints": work.get("maxPoints"),
                    "materials": work.get("materials", []),
                    "topicId": work.get("topicId"),
                    "workType": work.get("workType"),
                    "alternateLink": work.get("alternateLink")
                })
            
            if complete_data.get("course_work_materials"):
                for material in complete_data["course_work_materials"]:
                    stream_items.append({
                        "type": "material",
                        "id": material.get("id"),
                        "title": material.get("title"),
                        "description": material.get("description"),
                        "creationTime": material.get("creationTime"),
                        "updateTime": material.get("updateTime"),
                        "state": material.get("state"),
                        "materials": material.get("materials", []),
                        "topicId": material.get("topicId"),
                        "alternateLink": material.get("alternateLink")
                    })
            
            if complete_data.get("announcements"):
                for announcement in complete_data["announcements"]:
                    stream_items.append({
                        "type": "announcement",
                        "id": announcement.get("id"),
                        "title": "Announcement",
                        "description": announcement.get("text"),
                        "creationTime": announcement.get("creationTime"),
                        "updateTime": announcement.get("updateTime"),
                        "state": announcement.get("state"),
                        "materials": announcement.get("materials", []),
                        "alternateLink": announcement.get("alternateLink")
                    })
            
            stream_items.sort(key=lambda x: x.get("creationTime", ""), reverse=True)
            
            complete_data["stream_timeline"] = stream_items
            
        except Exception as e:
            print(f"Error creating stream timeline: {e}")
            complete_data["stream_timeline"] = []

        try:
            analytics = self._calculate_course_analytics(complete_data)
            complete_data["analytics"] = analytics
        except Exception as e:
            print(f"Error calculating analytics: {e}")
        
        return complete_data

    def check_user_permissions_for_course(self, course_id: str, user: Dict) -> Dict:
        """Check what permissions the current user has for a specific course"""
        permissions = {
            "course_id": course_id,
            "user_role": "unknown",
            "can_access_course": False,
            "can_access_students": False,
            "can_access_teachers": False,
            "can_access_coursework": False,
            "can_access_submissions": False,
            "course_state": "unknown",
            "errors": []
        }
        
        try:
            course = self.get_course(course_id)
            permissions["can_access_course"] = True
            permissions["course_state"] = course.get("courseState", "unknown")
        except Exception as e:
            permissions["errors"].append(f"Cannot access course: {str(e)}")
        
        try:
            teachers = self.get_teachers(course_id)
            permissions["can_access_teachers"] = True
            
            current_user_id = user.get('id', '')
            
            is_teacher = any(teacher.get('userId') == current_user_id for teacher in teachers)
            if is_teacher:
                permissions["user_role"] = "teacher"
            
        except Exception as e:
            permissions["errors"].append(f"Cannot access teachers: {str(e)}")
        
        try:
            students = self.get_students(course_id)
            permissions["can_access_students"] = True
            
            if permissions["user_role"] == "unknown":
                current_user_id = user.get('id', '')
                is_student = any(student.get('userId') == current_user_id for student in students)
                if is_student:
                    permissions["user_role"] = "student"
                    
        except Exception as e:
            permissions["errors"].append(f"Cannot access students: {str(e)}")
        
        try:
            coursework = self.get_coursework(course_id)
            permissions["can_access_coursework"] = True
        except Exception as e:
            permissions["errors"].append(f"Cannot access coursework: {str(e)}")
        
        if permissions["can_access_coursework"]:
            try:
                coursework = self.get_coursework(course_id)
                if coursework and len(coursework) > 0:
                    first_work = coursework[0]
                    submissions = self.get_student_submissions(course_id, first_work['id'])
                    permissions["can_access_submissions"] = True
            except Exception as e:
                permissions["errors"].append(f"Cannot access submissions: {str(e)}")
        
        recommendations = []
        if not permissions["can_access_coursework"]:
            recommendations.append("User needs teacher or owner role to access coursework")
        if not permissions["can_access_submissions"]:
            recommendations.append("User needs teacher role to access student submissions")
        if permissions["course_state"] != "ACTIVE":
            recommendations.append(f"Course is in {permissions['course_state']} state, may have limited functionality")
        
        permissions["recommendations"] = recommendations
        
        return permissions

    def get_student_view_for_course(self, course_id: str, user: Dict) -> Dict:
        """Get all data available to a student for a specific course"""
        current_user_id = user.get('id', '')
        
        student_data = {
            "course": {},
            "my_coursework": [],
            "my_submissions": [],
            "classmates": [],
            "teachers": [],
            "announcements": [],
            "materials": [],
            "my_grades": [],
            "student_analytics": {},
            "access_info": {
                "user_id": current_user_id,
                "view_type": "student",
                "accessible_data": [],
                "restricted_data": []
            }
        }
        
        try:
            course = self.get_course(course_id)
            student_data["course"] = course
            student_data["access_info"]["accessible_data"].append("Course basic info")
        except Exception as e:
            student_data["access_info"]["restricted_data"].append(f"Course info: {str(e)}")
        
        try:
            teachers = self.get_teachers(course_id)
            student_data["teachers"] = teachers
            student_data["access_info"]["accessible_data"].append("Teachers list")
        except Exception as e:
            student_data["access_info"]["restricted_data"].append(f"Teachers: {str(e)}")
        
        try:
            students = self.get_students(course_id)
            student_data["classmates"] = students
            student_data["access_info"]["accessible_data"].append("Classmates list")
        except Exception as e:
            student_data["access_info"]["restricted_data"].append(f"Students: {str(e)}")
        
        try:
            coursework = self.get_coursework(course_id)
            
            visible_coursework = []
            for work in coursework:
                assignee_mode = work.get('assigneeMode', 'ALL_STUDENTS')
                if assignee_mode == 'ALL_STUDENTS':
                    visible_coursework.append(work)
                elif assignee_mode == 'INDIVIDUAL_STUDENTS':
                    individual_options = work.get('individualStudentsOptions', {})
                    assigned_students = individual_options.get('studentIds', [])
                    if current_user_id in assigned_students:
                        visible_coursework.append(work)
            
            student_data["my_coursework"] = visible_coursework
            student_data["access_info"]["accessible_data"].append(f"My coursework ({len(visible_coursework)} assignments)")
            
        except Exception as e:
            error_msg = str(e)
            student_data["access_info"]["restricted_data"].append(f"Coursework: {error_msg}")
            
            if "403" in error_msg or "Forbidden" in error_msg:
                student_data["my_coursework"] = []
                student_data["coursework_limitation"] = {
                    "message": "Limited access to coursework data",
                    "explanation": "As a student, you have restricted access to detailed coursework information in this course.",
                    "available_alternatives": [
                        "Check Google Classroom directly for your assignments",
                        "Contact your teacher for assignment details",
                        "View your grades and submissions in the Google Classroom app"
                    ],
                    "why_limited": "Google Classroom API restricts coursework access based on user permissions in the course"
                }
        
        try:
            my_submissions = []
            
            if student_data.get("my_coursework"):
                for work in student_data["my_coursework"]:
                    try:
                        submissions = self.get_student_submissions(course_id, work['id'])
                        
                        my_work_submissions = [
                            sub for sub in submissions 
                            if sub.get('userId') == current_user_id
                        ]
                        
                        for submission in my_work_submissions:
                            submission['courseWorkTitle'] = work.get('title', 'Untitled')
                            submission['courseWorkMaxPoints'] = work.get('maxPoints', 0)
                            submission['dueDate'] = work.get('dueDate')
                            my_submissions.append(submission)
                            
                    except Exception as e:
                        print(f"Error fetching my submissions for {work['id']}: {e}")
                        continue
            else:
                student_data["submissions_limitation"] = {
                    "message": "Cannot access submission data",
                    "reason": "Coursework data is not accessible with current permissions",
                    "suggestion": "Check your submissions directly in Google Classroom"
                }
            
            student_data["my_submissions"] = my_submissions
            if my_submissions:
                student_data["access_info"]["accessible_data"].append(f"My submissions ({len(my_submissions)})")
            else:
                student_data["access_info"]["restricted_data"].append("My submissions: Limited access")
            
        except Exception as e:
            student_data["access_info"]["restricted_data"].append(f"My submissions: {str(e)}")
        
        try:
            my_grades = []
            for submission in student_data["my_submissions"]:
                if submission.get('assignedGrade') is not None:
                    grade_info = {
                        "coursework_title": submission.get('courseWorkTitle'),
                        "earned_points": submission.get('assignedGrade'),
                        "max_points": submission.get('courseWorkMaxPoints'),
                        "percentage": (submission.get('assignedGrade') / submission.get('courseWorkMaxPoints') * 100) if submission.get('courseWorkMaxPoints') else 0,
                        "state": submission.get('state'),
                        "late": submission.get('late'),
                        "submission_date": submission.get('updateTime')
                    }
                    my_grades.append(grade_info)
            student_data["my_grades"] = my_grades
        except Exception as e:
            student_data["access_info"]["restricted_data"].append(f"My grades: {str(e)}")

        return student_data
