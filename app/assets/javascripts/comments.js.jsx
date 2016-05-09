/** @jsx React.DOM */

var IdeaBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: { comment: comment },
        success: function(data) {
        }.bind(this),
        error: function() {
          comments.pop();
          this.setState({data: comments});
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="ideaBox">
        <CommentForm data={this.state.data} onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

const currentUserImage = "../images/user_3.jpg";

var RenderComments = React.createClass({
    render: function() {

        var comments = this.props.data.map(function(comment, index) {
                return (
                    <ul className="comments-list">
                    <li className="comment" key={index}>
                    <a className="pull-left" href="#">
                    <img className="avatar" src={currentUserImage} alt="avatar"/>
                    </a>
                    <div className="comment-body">
                    <div className="comment-heading">
                    <h4 className="user">Gavino</h4>
                    <h5 className="time">5 minutes ago</h5>
                </div>
                <p>{comment.text}</p>
            </div>
            </li>
            </ul>
        );
    });
return(
    <div>{comments}</div>
);
}
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    const comment = this.refs.text.getDOMNode().value.trim();
    if (!comment) {
      return;
    }
    this.props.onCommentSubmit({text: comment});
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render() {
    return (
        <div className="panel-body">
          <form className="commentForm " onSubmit={this.handleSubmit}>
            <div className="form-group">
                <section className="main-section" id="client_outer">
                        <div className="col-sm-12" id="idea_first">
                        <div className="panel panel-white post panel-shadow">
                        <div className="post-heading">
                        <div className="pull-left image">
                        <img src="../images/user_1.jpg" className="img-circle avatar" alt="user profile image"/>
                        </div>
                        <div className="pull-left meta">
                        <div className="title h5">
                        <a href="#"><b>Smart MRT System</b></a>
                    </div>
                    <h6 className="text-muted time">Submitted By harry, 1 month ago</h6>
                    <div className="vote-button"><input type="submit" className="btn btn-warning" value="Vote" /></div>
                        <div className="vote-count">12 Votes</div>
                    </div>
                    </div>
                    <div className="post-description">
                        <p>Smart MRT E Ticket system will allow travellers to easily book there travel tickets without any queue.</p>
                    </div>

                    <div className="post-footer comments collapse in" id="comment_section">
                        <div className="input-group">
                        <textarea className="form-control" id="commentInput" rows="2" placeholder="Your comments" ref="text"/>
                        <span className="input-group-addon" id="btn_submit_comments">
                        <input type="submit" className="btn btn-default" value="Add" />
                        </span>
                        </div>
                        <RenderComments data={this.props.data} />
                    </div>
                    </div>
                    </div>
                </section>
            </div>
          </form>
        </div>
    );
  }
});

$(document).on("page:change", function() {
  const $content = $("#content");
  if ($content.length > 0) {
    React.renderComponent(
      <IdeaBox url="comments.json" pollInterval={2000} />,
      document.getElementById('content')
    );
  }
})
