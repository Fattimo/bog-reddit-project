const { Post } = require('../models')

module.exports.index = (req, res, next) => {
  let dateRange = req.query.dateRange
  let currDate = parseISOString(req.query.currDate)
  //console.log(currDate)
  //console.log(currDate instanceof Date)

  const filterDateTo = (newerThan) => {
    Post.find({createdAt: {$gte: newerThan}})
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = { posts }
        res.locals.status = 200
        return next()
      })
      .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
      })
  }
  
  const filterDateFrom = (olderThan) => {
    Post.find({createdAt: {$lte: olderThan}})
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = { posts }
        res.locals.status = 200
        return next()
      })
      .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
      })
  }

  if (dateRange == "Past week") {
    filterDateTo(new Date(currDate.valueOf() - 6.048e8))
  } else if (dateRange == "Past month") {
    filterDateTo(currDate.setMonth(currDate.getMonth() - 1))
  } else if (dateRange ==  "Past year") {
    filterDateTo(currDate.setFullYear(currDate.getFullYear() - 1))
  } else if (dateRange ==  "A year ago") {
    filterDateFrom(currDate.setFullYear(currDate.getFullYear() - 1))
  } else if (dateRange == "Ancient times") {
    filterDateFrom(currDate.setFullYear(currDate.getFullYear() - 10))
  } else {
    filterDateFrom(new Date())
  }
}

//https://stackoverflow.com/questions/27012854/change-iso-date-string-to-date-object-javascript
function parseISOString(s) {
  if (s === undefined) {
    return
  }
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

module.exports.get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then(post => {
      res.locals.data = { post }
      res.locals.status = post === null ? 404 : 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.errors = { error: err.message }
      return next()
    })
}

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body)
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.update = (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  })
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndCascadeDelete({ _id: req.params.id })
    .then(_ => {
      res.locals.data = { deleted: 'Success' }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.comment = (req, res, next) => {
  Post.findByIdAndAddComment(req.params.id, req.body)
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.dateDummy = (req, res, next) => {
  let date = new Date(req.body.date)
  const newPost = new Post({
    author: req.body.author,
    title: req.body.title,
    text: req.body.text,
    upvotes: 400,
    downvotes: 100,
    createdAt: date.toISOString(),
  })
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}


module.exports.upVote = (req, res, next) => {
  // console.log(req.params.toggle)
  // console.log(req.params.toggle==="true" ? -1:1)
  Post.changeUpVote(req.params.id, req.params.toggle==="true" ? -1:1)
  .then(post => {
    res.locals.data = { post }
    res.locals.status = 200
    return next()
  })
  .catch(err => {
    console.error(err)
    res.locals.error = { error: err.message }
    res.locals.status = 400
    return next()
  })
}

module.exports.downVote = (req, res, next) => {

  Post.changeDownVote(req.params.id, req.params.toggle==="true" ? -1:1)
  .then(post => {
    res.locals.data = { post }
    res.locals.status = 200
    return next()
  })
  .catch(err => {
    console.error(err)
    res.locals.error = { error: err.message }
    res.locals.status = 400
    return next()
  })
}