import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { TaskServiceService } from "../services/task-service.service";
import { TaskModel } from "../model/task.model";
import { BehaviorSubject, catchError, finalize, map, Observable, of } from "rxjs";

export class taskdatasource extends DataSource<TaskModel> {
    private tasksubject = new BehaviorSubject<TaskModel[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private loading$ = this.loadingSubject.asObservable();
    public paginatorTotal = new BehaviorSubject<number>(0)
    public paginatorCount$ = this.paginatorTotal.asObservable();

    constructor(private taskService: TaskServiceService) {
        super();
    }
    connect(collectionViewer: CollectionViewer): Observable<TaskModel[]> {
        return this.tasksubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.tasksubject.complete();
        this.loadingSubject.complete();
    }

    loadTask(from: number, to: number, title: string, userId: number, isarchive: boolean, userIds: any, StatusIds: any, FromDate: any, ToDate: any, sortbyduedate: any, sortcolumn: any, sortorder: any) {
        this.loadingSubject.next(true);
        this.taskService.mytask(from, to, title, userId, isarchive, userIds, FromDate, ToDate, StatusIds, sortbyduedate, sortcolumn, sortorder).pipe
        (map(
            res =>{
                this.paginatorTotal.next(res.data.TotalCount);
                this.tasksubject.next(res.data.TaskList);
            }
        ),
            catchError(() => of([])),
            finalize(() => {
                this.loadingSubject.next(false);
            })
        ).subscribe();

    }

    loadCC(from: number, to: number, title: string, userId: any, isarchive: any, StatusIds: any, priority: any, userIds: any) {
        this.loadingSubject.next(true);
        this.taskService.cc(from, to, title, userId, isarchive, StatusIds, priority, userIds)
            .pipe(map(
                res =>{
                    this.paginatorTotal.next(res.data.TotalCount);
                    this.tasksubject.next(res.data.TaskList);
                }
            ),
                catchError(() => of([])),
                finalize(() => {
                    this.loadingSubject.next(false);
                })
            ).subscribe();
    }

    loadAssingByMeTask(from: number, to: number, title: string, userId: any, isarchive: boolean, userIds: any, StatusIds: any, FromDate: any, ToDate: any, sortbyduedate: any) {
        this.loadingSubject.next(true);
        this.taskService.assignByMeTask(from, to, title, userId, isarchive, userIds, FromDate, ToDate, StatusIds, sortbyduedate).pipe(map(
                res =>{
                    this.paginatorTotal.next(res.data.TotalCount);
                    this.tasksubject.next(res.data.TaskList);
                }
        ),
            catchError(() => of([])),
            finalize(() => {
                this.loadingSubject.next(false);
            })
        ).subscribe();
    }

    loadArchiveList(from : number,to : number,isarchive : boolean,title : string,userId : any,userIds : any){
        this.loadingSubject.next(true);
        this.taskService.archiveList(from,to,isarchive,title,userId,userIds)
        .pipe(map
            ( res =>{
                this.paginatorTotal.next(res.data.TotalCount);
                this.tasksubject.next(res.data.TaskList);
            }),
            catchError(() => of([])),
            finalize(() =>{
                this.loadingSubject.next(false);
            })
        ).subscribe();
    }

}