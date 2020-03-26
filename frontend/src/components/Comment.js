import React from 'react'
import AddComment from './AddComment'
import './Post.css'

const Comment = props => {
  const [replyOpen, setReplyOpen] = React.useState(false)

  const toggleReply = () => setReplyOpen(!replyOpen)

  const saveComment = commentData => {
    setReplyOpen(false)
    props.onComment(props.comment._id, commentData)
  }

  const[upvote, setUpvote] = React.useState(false)
  const[downvote, setDownvote] = React.useState(false)
  const[totVotes, setTotVotes] = React.useState(props.comment.upVotes - props.comment.downVotes)

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
          <div className="author">Posted by {props.comment.author}</div>
          <div>{props.comment.text}</div>
          <div className="button-row">
            <button onClick={_ => props.onDelete(props.comment._id)}>
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
        {props.comment.comments.map(com => (
          <Comment
            key={com._id}
            comment={com}
            onDelete={props.onDelete}
            onEdit={props.onEdit}
            onComment={props.onComment}
          />
        ))}
      </section>
    </>
  )
}

export default Comment
