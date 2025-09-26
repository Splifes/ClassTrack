import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional

try:
    import pytz
except ImportError:
    pytz = None

class GoogleCalendarService:
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = 'https://www.googleapis.com/calendar/v3'
        self.headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
    
    def get_course_calendar_events(self, course_id: str, time_min: Optional[str] = None, time_max: Optional[str] = None) -> List[Dict]:
        """
        Get calendar events for a specific course.
        
        Args:
            course_id: The Google Classroom course ID
            time_min: RFC3339 timestamp for start of time range (optional)
            time_max: RFC3339 timestamp for end of time range (optional)
        
        Returns:
            List of calendar events
        """
        try:
            # If no time range specified, get events from 30 days ago to 30 days ahead
            if not time_min:
                if pytz:
                    time_min = (datetime.now(pytz.UTC) - timedelta(days=30)).isoformat()
                else:
                    time_min = (datetime.utcnow() - timedelta(days=30)).isoformat()
            if not time_max:
                if pytz:
                    time_max = (datetime.now(pytz.UTC) + timedelta(days=30)).isoformat()
                else:
                    time_max = (datetime.utcnow() + timedelta(days=30)).isoformat()
            
            params = {
                'timeMin': time_min,
                'timeMax': time_max,
                'singleEvents': True,
                'orderBy': 'startTime',
                'q': f'course:{course_id}'  # Search for events related to the course
            }
            
            response = requests.get(f'{self.base_url}/calendars/primary/events', headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            return data.get('items', [])
        except requests.RequestException as e:
            print(f"Error fetching calendar events: {e}")
            return []
    
    def get_event_details(self, event_id: str, calendar_id: str = 'primary') -> Optional[Dict]:
        """Get detailed information about a specific calendar event."""
        try:
            response = requests.get(f'{self.base_url}/calendars/{calendar_id}/events/{event_id}', headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching event details: {e}")
            return None
    
    def create_class_event(self, course_id: str, course_name: str, start_time: str, end_time: str, description: str = "") -> Optional[Dict]:
        """
        Create a new class event in the calendar.
        
        Args:
            course_id: The Google Classroom course ID
            course_name: Name of the course
            start_time: RFC3339 timestamp for event start
            end_time: RFC3339 timestamp for event end
            description: Event description (optional)
        
        Returns:
            Created event data or None if failed
        """
        try:
            event_data = {
                'summary': f'{course_name} - Class Session',
                'description': f'{description}\n\nCourse ID: {course_id}',
                'start': {
                    'dateTime': start_time,
                    'timeZone': 'UTC'
                },
                'end': {
                    'dateTime': end_time,
                    'timeZone': 'UTC'
                },
                'extendedProperties': {
                    'private': {
                        'courseId': course_id,
                        'eventType': 'class_session'
                    }
                }
            }
            
            response = requests.post(f'{self.base_url}/calendars/primary/events', headers=self.headers, json=event_data)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error creating calendar event: {e}")
            return None
    
    def get_class_sessions_for_course(self, course_id: str, days_back: int = 30, days_ahead: int = 30) -> List[Dict]:
        """
        Get all class sessions (calendar events) for a specific course.
        
        Args:
            course_id: The Google Classroom course ID
            days_back: Number of days to look back (default: 30)
            days_ahead: Number of days to look ahead (default: 30)
        
        Returns:
            List of class session events
        """
        try:
            if pytz:
                time_min = (datetime.now(pytz.UTC) - timedelta(days=days_back)).isoformat()
                time_max = (datetime.now(pytz.UTC) + timedelta(days=days_ahead)).isoformat()
            else:
                time_min = (datetime.utcnow() - timedelta(days=days_back)).isoformat()
                time_max = (datetime.utcnow() + timedelta(days=days_ahead)).isoformat()
            
            # Get all events and filter for class sessions
            events = self.get_course_calendar_events(course_id, time_min, time_max)
            
            # Filter events that are class sessions
            class_sessions = []
            for event in events:
                # Check if event is related to this course
                extended_props = event.get('extendedProperties', {}).get('private', {})
                if (extended_props.get('courseId') == course_id and 
                    extended_props.get('eventType') == 'class_session'):
                    class_sessions.append(event)
                elif course_id.lower() in event.get('summary', '').lower():
                    # Fallback: check if course ID is in the event title
                    class_sessions.append(event)
            
            return class_sessions
        except Exception as e:
            print(f"Error getting class sessions: {e}")
            return []
    
    def update_event_attendees(self, event_id: str, attendees: List[Dict], calendar_id: str = 'primary') -> Optional[Dict]:
        """
        Update the attendees list for a calendar event.
        
        Args:
            event_id: The calendar event ID
            attendees: List of attendee objects with email and responseStatus
            calendar_id: Calendar ID (default: 'primary')
        
        Returns:
            Updated event data or None if failed
        """
        try:
            # First get the current event
            event = self.get_event_details(event_id, calendar_id)
            if not event:
                return None
            
            # Update attendees
            event['attendees'] = attendees
            
            response = requests.put(f'{self.base_url}/calendars/{calendar_id}/events/{event_id}', 
                                  headers=self.headers, json=event)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error updating event attendees: {e}")
            return None
