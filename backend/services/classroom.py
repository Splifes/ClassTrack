import requests
from typing import Dict, List, Optional

class GoogleClassroomService:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://classroom.googleapis.com/v1'
        self.headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
    
    def get_courses(self) -> List[Dict]:
        """Get all courses for the authenticated user"""
        try:
            response = requests.get(f'{self.base_url}/courses', headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get('courses', [])
        except requests.RequestException as e:
            print(f"Error fetching courses: {e}")
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
        """Get students enrolled in a course"""
        try:
            response = requests.get(f'{self.base_url}/courses/{course_id}/students', headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get('students', [])
        except requests.RequestException as e:
            print(f"Error fetching students for course {course_id}: {e}")
            return []
    
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
    
    def get_student_submissions(self, course_id: str, coursework_id: str) -> List[Dict]:
        """Get student submissions for specific coursework"""
        try:
            response = requests.get(
                f'{self.base_url}/courses/{course_id}/courseWork/{coursework_id}/studentSubmissions',
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('studentSubmissions', [])
        except requests.RequestException as e:
            print(f"Error fetching submissions for coursework {coursework_id}: {e}")
            return []
