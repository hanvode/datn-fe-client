import moment from 'moment'
import Rating from '../rating/Rating'
import './commentCard.css'


const CommentCard = ({children,comment}) => {
  return (
    <div className='comment_card'>
      <div className="comment_card_row">
            { comment.userId ? 
              <h3 style={{color:"green"}}>{comment.username}</h3>
            : <h3>{comment.username}</h3>
            }
            {
                 comment.rating !== 0 && <Rating props={comment}/>
            }
      </div>
      <span>{moment(comment.createdAt).fromNow()}</span>
      <span>{new Date(comment.createdAt).toLocaleString()}</span>
      <p dangerouslySetInnerHTML={{__html: comment.content}}/>
      {children}
    </div>
  )
}

export default CommentCard