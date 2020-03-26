import React from 'react'
import Comment from './Comment'
import AddComment from './AddComment'
import './Post.css'

const Post = props => {
  //Reply State
  const [replyOpen, setReplyOpen] = React.useState(false)

  const toggleReply = () => setReplyOpen(!replyOpen)

  const saveComment = commentData => {
    setReplyOpen(false)
    props.onComment(props.post._id, commentData)
  }
  //Up/down vote State
  //true/false vars for up down vote
  //global original vote variable?
    
  const[upvote, setUpvote] = React.useState(false)
  const[downvote, setDownvote] = React.useState(false)
  const[totVotes, setTotVotes] = React.useState(props.post.upVotes - props.post.downVotes)

  const clickUpvote = () => {
    if (!upvote) { //upvote is not toggled and is being toggled
      if (downvote) {//the downvote button was on
        setDownvote(!downvote)
        //raise by one then raise by one
        setTotVotes(totVotes+2)
      } else {//the downvote button was off
        //raise by one
        setTotVotes(totVotes+1)
      }
    } else { // the upvote has been toggled off
      //decrement by one
      setTotVotes(totVotes-1)
    }
    setUpvote(!upvote)//NOTE: state change is async, so do it at the end of non async operation
  }

  const clickDownvote = () => {
    if (!downvote) {//downvote is not toggled and is being toggled
      if (upvote) {
        setUpvote(!upvote)
        //decrement by one then decrement by one
        setTotVotes(totVotes-2)
      } else {
        //decrement by one
        setTotVotes(totVotes-1)
      }
    } else { //the downvote button has been toggled off
      //increment by one
      setTotVotes(totVotes+1)
    }
    setDownvote(!downvote)
  }

  return (
    <>
      <section className="post">
        <div className="arrows">
          <button onClick = {clickUpvote} className={upvote ? "upSelected":""}>↑</button>
          <span className="center">
            {totVotes}
          </span>
          <button onClick = {clickDownvote} className={downvote ? "downSelected":""}>↓</button>
        </div>
        <div className="post-body">
          <div className="author">Posted by {props.post.author}</div>
          <div className="header">{props.post.title}</div>
          <div>{props.post.text}</div>
          <div className="button-row">
            <button onClick={() => props.onDelete(props.post._id)}>
              Delete
            </button>
            <button onClick={toggleReply}>Reply</button>​
            {replyOpen && (
              <AddComment
                onSubmit={saveComment}
                onCancel={() => setReplyOpen(false)}
              />
            )}
          </div>
        </div>
      </section>
      <section className="comments">
        {props.post.comments.map(com => (
          <Comment
            key={com._id}
            comment={com}
            onDelete={props.onCommentDelete}
            onEdit={props.onCommentEdit}
            onComment={props.onSubComment}
          />
        ))}
      </section>
    </>
  )
}

export default Post
