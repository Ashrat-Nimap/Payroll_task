export interface TaskModel {
    RowNumber: number | null;
    TaskId: number;
    Title: string;
    Description: string;
    AssignedByUserId: number;
    AssignedByUserName: string;
    TaskEndDate: string; 
    Priority: string;
    TaskStatus: number;
    MultimediaType: string;
    MultimediaName: string;
    AssignedToUserId: number;
    AssignedToUserName: string;
    TaskCommentCount: number;
    CreateDate: string;
    CompletedDate: string; 
    IsArchive: boolean;
    Latitude: number;
    Longitude: number;
    Location: string;
    IntercomGroupId: number;
    MultimediaModifiedDate: string;
    CompletionPercentage: number;
}