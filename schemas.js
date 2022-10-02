const mongoose = require('mongoose')

//schemas
const FilmSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		duration: {
			type: Number,
			required: true
		},
		categories: {
			type: String,
			required: true
		},
		rating: {
			type: Number,
			min: 0,
			required: true
		},
		ratingsAmount: {
			type: Number,
			min: 0,
			required: true
		},
		thumbnail: {
			type: String,
			required: true
		},
		shortDescription: {
			type: String,
			required: true
		},
		longDescriptionHTML: {
			type: String,
			required: true
		},
		photos: {
			type: String,
			required: true
		},
		yearOfProduction: {
			type: Number,
			required: false
		},
		similar: {
			type: String,
			required: true
		},
		updatedAt: {
			type: Date,
			required: false
		},
		updated_by: {
			type: Date,
			required: false
		}
	},
	{ collection: 'filmy' })

// Tutaj dodać numer odcinka.
const SeriesSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		duration: {
			type: Number,
			required: true
		},
		categories: {
			type: String,
			required: true
		},
		rating: {
			type: Number,
			required: true
		},
		ratingsAmount: {
			type: Number,
			required: true
		},
		premiere: {
			type: String,
			required: false
		},
		thumbnail: {
			type: String,
			required: true
		},
		shortDescription: {
			type: String,
			required: true
		},
		longDescriptionHTML: {
			type: String,
			required: true
		},
		photos: {
			type: String,
			required: true
		},
		yearOfProduction: {
			type: String,
			required: false
		},
		similar: {
			type: String,
			required: true
		},
		episodesAmount : {
			type: Number,
			required: true
		},
		updatedAt: {
			type: Date,
			required: false
		},
		updated_by: {
			type: Date,
			required: false
		}
	},
	{ collection: 'seriale' })


	// Tutaj dodać numer odcinka.
const PremiereSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		duration: {
			type: Number,
			required: true
		},
		categories: {
			type: String,
			required: true
		},
		rating: {
			type: Number,
			required: true
		},
		ratingsAmount: {
			type: Number,
			required: true
		},
		premiere: {
			type: String,
			required: false
		},
		thumbnail: {
			type: String,
			required: true
		},
		shortDescription: {
			type: String,
			required: true
		},
		longDescriptionHTML: {
			type: String,
			required: true
		},
		photos: {
			type: String,
			required: true
		},
		similar: {
			type: String,
			required: true
		},
		updatedAt: {
			type: Date,
			required: false
		},
		updated_by: {
			type: Date,
			required: false
		}
	},
	{ collection: 'premiery' })


	const ActorSchema = mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		rating: {
			type: Number,
			required: true
		},
		ratingsAmount: {
			type: Number,
			required: true
		},
		thumbnail: {
			type: String,
			required: true
		},
		shortDescription: {
			type: String,
			required: true
		},
		longDescriptionHTML: {
			type: String,
			required: true
		},
		photos: {
			type: String,
			required: true
		},
		yearOfProduction: {
			type: String,
			required: false
		},
		similar: {
			type: String,
			required: true
		},
		updatedAt: {
			type: Date,
			required: false
		},
		updated_by: {
			type: Date,
			required: false
		}
	},
	{ collection: 'aktorzy' })


const CommentSchema = new mongoose.Schema({
	commentContent: {
		type: String,
		required: true
	},
	source_id: {
		type: String,
		required: true
	},
	parent_id: {
		type: String,
		required: true
	},
	timeCreated: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true
	},
	likes: {
		type: Number,
		required: true
	},
	hasChild: {
		type: Boolean,
		required: true
	},
	usersThatLiked: {
		type: String,
		required: false
	},
	updatedAt: {
		type: Date,
		required: false
	},
	updated_by: {
		type: Date,
		required: false
	}
},
{ collection: 'comments' })



const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		minLength: 4,
		maxLength: 50,
		required: true
	},
	password: {
		type: String,
		minLength: 4,
		maxLength: 200,
		required: true
	},
	email: {
		type: String,
		minLength: 4,
		maxLength: 50,
		required: true
	},
	dateofbirth: {
		type: Number,
		required: true
	},
	from: {
		type: String,
		maxLength: 50,
		required: true
	},
	commentsamount: {
		type: Number,
		min: 0,
		required: true
	},
	ratingsamount: {
		type: Number,
		min: 0,
		required: true
	},
	avatar: {
		type: String,
		required: false
	},
	about: {
		type: String,
		minLength: 10,
		maxLength: 300,
		required: true
	},
	authorized: {
		type: Boolean,
		required: true
	},
	token: {
		type: String,
		required: false
	}
})

const RatingSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	ratedPositionID: {
		type: String,
		required: true
	},
	dbName: {
		type: String,
		required: true
	},
	timeCreated: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	}
})

const MessageSchema = new mongoose.Schema({
	sender: {
		type: String,
		required: true
	},
	receiver: {
		type: String,
		required: true
	},
	time_sent: {
		type: Number,
		required: true
	},
	time_received: {
		type: Number,
		required: false
	},
	content: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	}
})

const NewsSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	thumbnail: {
		type: String,
		required: true
	},
	photos: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	related_articles: {
		type: String,
		required: true
	},
	date: {
		type: Number,
		required: true
	},
	updatedAt: {
		type: Date,
		required: false
	},
	updated_by: {
		type: Date,
		required: false
	}
})


const SearchItemSchema =  new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	premiere: {
		type: String,
		required: false
	},
	thumbnail: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: String,
		required: false
	},
	type: {
		type: String,
		required: true
	}
},
{ collection: 'search_items' })


const filmCategorySchema =  new mongoose.Schema({
	name: {
		type: String,
		required: true
	}
},
{ collection: 'filmy_categories' })

//models
const Film = mongoose.model('Film', FilmSchema)
const Series = mongoose.model('Series', SeriesSchema)
const Premiere = mongoose.model('Premiere', PremiereSchema)
const Actor = mongoose.model('Actor', ActorSchema)
const User = mongoose.model('User', UserSchema)
const Comment = mongoose.model('Comment', CommentSchema)
const Rating = mongoose.model('Rating', RatingSchema)
const Message = mongoose.model('Message', MessageSchema)
const News = mongoose.model('News', NewsSchema)
const SearchItem = mongoose.model('SearchItem', SearchItemSchema)
const filmCategory = mongoose.model('filmCategory', filmCategorySchema)



//exports
module.exports.Film = Film
module.exports.Series = Series
module.exports.Premiere = Premiere
module.exports.Actor = Actor
module.exports.User = User
module.exports.Comment = Comment
module.exports.Rating = Rating
module.exports.Message = Message
module.exports.News = News
module.exports.SearchItem = SearchItem
module.exports.filmCategory = filmCategory