import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
 // isLoading: boolean = false;
  //we will destroy it when the component is no longer alive
  private postsSub: Subscription;

  constructor(public postService: PostsService) {}

  ngOnInit(): void {
   // this.isLoading = true;
    this.postService.getPosts();
    //subscribe to the observable to listen to new data received
    this.postsSub = this.postService.getPostUpdateListener()
     .subscribe((posts: Post[]) => {
      // this.isLoading = false;
       this.posts = posts;
    })
  }

  onDelete(postId: string){
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
