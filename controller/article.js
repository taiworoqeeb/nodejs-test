const Comment = require('../model/comment');
const Reply = require('../model/reply');


var Post = [{
    id: 1,
    desc: "Test Ariticle",
    content: "How to write a nodejs test"
},
{
    id: 2,
    desc: "Test Ariticle 2",
    content: "How to write a nodejs test 2"
},

]

exports.createComment = async(req, res, next)=>{
    var id = req.params.postId
    const {name, comment} = req.body;
    try {
        if(!name){
            res.status(401).json({
                status: false,
                message: "Please enter your name"
            })
        }

        if(!comment){
            res.status(401).json({
                status: false,
                message: "Comment cannot be empty"
            })
        }

        if(!id){
            res.status(404).json({
                status: false,
                message: "Post Id not found"
            })
        }
        var checkId = Post.find(post =>{
            if(post.id === id){
                return {
                    post,
                    status: true
                }
            }else{
                return {
                    status: false
                }
            }
        })
        if(checkId){
            const new_comment = new Comment({
                postId: id,
                name: name,
                comment: comment
            })

            var Out = await new_comment.save()

            res.status(201).json({
                status: true,
                message: 'Comment added successfully',
                data:{
                    article: checkId,
                    comment: Out 
                }

            })

        }else{
            res.status(404).json({
                status: false,
                message: "Article not found"
            })
        }
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.createReply = async(req, res, next)=>{
    const id = req.params.commentId
    const {name, reply} = req.body;
    try {
        if(!name){
            res.status(401).json({
                status: false,
                message: "Please enter your name"
            })
        }

        if(!reply){
            res.status(401).json({
                status: false,
                message: "Response cannot be empty"
            })
        }

        if(!id){
            res.status(404).json({
                status: false,
                message: "Comment Id not found"
            })
        }

        await Comment.findById(id)
        .then(async(comment) =>{
            if(!comment){
                res.status(404).json({
                    status: false,
                    message: "Comment not found"
                })
            }

            const new_reply = new Reply({
                comment: comment._id,
                name: name,
                reply: reply
            })

            var Out = await new_reply.save()

            await Comment.findByIdAndUpdate(comment._id, {
                $push: {reply: Out._id}
            },{new: true})

            var commentOut = await Comment.findById(comment._id)

            res.status(201).json({
                status: true,
                message: "Response sent",
                data:{
                    comment: commentOut,
                    reply: Out
                }
                
            })
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.getPostById = async(req, res, next)=>{
    var id = req.params.postId
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Post id not found"
            })
        }
        await Comment.find({
            postId: id
        })
        .populate(['reply'])
        .then(async(comment)=>{
            if(!comment){
                res.status(404).json({
                    status: false,
                    message: "Comment not found"
                })
            }

         var post = Post.find((pos) => pos.id === id)   

            res.status(200).json({
                status: true,
                data:{
                    article: post,
                    comment: comment
                }
            })
        })
        
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.voteComment = async(req, res, next)=>{
    var status = req.query.status
    var id = req.params.commentId
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Comment id not found"
            })
        }
        await Comment.findById(id)
        .then(async(comment)=>{
            if(!comment){
                res.status(404).json({
                    status: false,
                    message: "Comment not found"
                })
            }
            if(status === 'upvote'){
                await Comment.findByIdAndUpdate(comment._id, {
                    $inc:{upvote: 1}
                })
                res.status(200).json({
                    status: true,
                    message: `Comment ${status}d`
                })
            }else if(status === 'downvote'){
                await Comment.findByIdAndUpdate(comment._id, {
                    $inc:{downvote: 1}
                })
                res.status(200).json({
                    status: true,
                    message: `Comment ${status}d`
                })
            }else if(!status || status === undefined || status === null ){
                res.status(401).json({
                    status: false,
                    message: "Status query can't be empty"
                })
            }
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.getPosts = (req, res, next)=>{
    try {
        res.status(200).json({
            status: true,
            data: Post
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.deleteComment = async(req, res, next)=>{
    const id = req.params.commentId
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Comment Id not found"
            })
        }
        await Comment.findById(id)
        .populate(['reply'])
        .then(async(comment)=>{
            if(!comment){
                res.status(404).json({
                    status: false,
                    message: "Comment not found"
                })
            }

            if(comment.reply?.length){
                for(var i=0; i<= comment.reply.length; i++){
                    await Reply.findByIdAndDelete(comment.reply[i]._id)
                }
            }
            
            await Comment.findByIdAndDelete(comment._id)

            res.status(200).json({
                status: true,
                message: "Comment deleted"
            })

        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.deleteReply = async(req, res, next)=>{
    const id = req.params.replyId
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Reply id not found"
            })
        }
        await Reply.findById(id)
        .then(async(reply)=>{
            if(!reply){
                res.status(404).json({
                    status: false,
                    message: "Reply not found"
                })
            }

            await Reply.findByIdAndDelete(reply._id)
            res.status(200).json({
                status: true,
                message: "Reply deleted"
            })
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.updateComment = async(req, res, next)=>{
    const id = req.params.commentId
    const {commentUpdate} = req.body;
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Comment id not found"
            })
        }
        await Comment.findById(id)
        .then(async(comment)=>{
            if(!comment){
                res.status(404).json({
                    status: false,
                    message: "Comment not found"
                })
            }

            await Comment.findByIdAndUpdate(comment._id, {
                comment: commentUpdate
            })

            res.status(200).json({
                status: true,
                message: "Comment updated"
            })
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}

exports.updateReply = async(req, res, next)=>{
    const id = req.params.replyId
    const {replyUpdate} = req.body;
    try {
        if(!id){
            res.status(404).json({
                status: false,
                message: "Reply id not found"
            })
        }
        await Reply.findById(id)
        .then(async(reply)=>{
            if(!reply){
                res.status(404).json({
                    status: false,
                    message: "reply not found"
                })
            }

            await Reply.findByIdAndUpdate(reply._id, {
                reply: replyUpdate
            })

            res.status(200).json({
                status: true,
                message: "Reply updated"
            })
        })
    } catch (error) {
        console.error(error);
        res.json(error)
        next(error)
    }
}