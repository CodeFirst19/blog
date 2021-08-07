import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";


//Do this if you dont' add this service in the providers in the app.module.ts
 @Injectable({providedIn: 'root'})
export class PostsService{
    
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getPosts(){
        this.httpClient.get<{message:string, posts:any}>('http://localhost:3000/api/posts')
         .pipe(map((postData) => {
             return postData.posts.map((post) => {
                 return {
                     id: post._id,
                     title: post.title,
                     content: post.content
                 };
             });
         }))
         .subscribe((transformedPosts) => {
             this.posts = transformedPosts;
             this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdateListener() {
        //listen to changes made to the posts list and emit as obsevable
        return this.postsUpdated.asObservable();
    }

    getPost(id: string){
        return this.httpClient
         .get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
    }


    updatePost(id: string, title: string, content: string){
        const post: Post = {id: id, title: title, content: content}
        this.httpClient.put("http://localhost:3000/api/posts/" + id, post)
         .subscribe(response => {
             const updatedPosts = [... this.posts];
             const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
             updatedPosts[oldPostIndex] = post;  
             this.posts = updatedPosts  
             this.postsUpdated.next([...this.posts])
             this.router.navigate(["/"]);
         });
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title:title, content:content};
        this.httpClient.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post)
        .subscribe((responseData) => {
            const id = responseData.postId;
            post.id = id;
            this.posts.push(post);
            //create new copy of posts lists after its updated
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
    }

    deletePost(postId:String){
        this.httpClient.delete("http://localhost:3000/api/posts/" + postId)
         .subscribe(() => {
            this.posts = this.posts.filter(post => { post.id !== postId; });
             this.postsUpdated.next([...this.posts]);
         });
    }
}