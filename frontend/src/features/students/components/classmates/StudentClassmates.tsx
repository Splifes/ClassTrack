import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import type { StudentClassmatesProps } from '../../types'

export function StudentClassmates({ studentData }: StudentClassmatesProps) {
  return (
    <div className="row">
      <div className="col-12">
        <Card>
          <CardHeader>
            <CardTitle>My Classmates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="row">
              {studentData.classmates?.map((classmate: any, index: number) => (
                <div key={index} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        {classmate.profile?.photoUrl && (
                          <img 
                            src={classmate.profile.photoUrl} 
                            alt={classmate.profile.name.fullName}
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                          />
                        )}
                        <div>
                          <h6 className="mb-0">{classmate.profile?.name?.fullName}</h6>
                          <small className="text-muted">{classmate.profile?.emailAddress}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
