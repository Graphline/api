import fetch from 'node-fetch'

export default {
  'name':  'Topic',
  'query': 'forumTopics',

  async root (root, {category,}, context) {
    const {topics,} = await fetch(`https://forums.openusercss.org/api/category/${category}`)
    .then((res) => res.json())

    const result = topics.map((topic) => ({
      'title':   topic.title,
      'url':     `https://forums.openusercss.org/topic/${topic.slug}`,
      'created': topic.timestampISO,
      'author':  topic.user.username,
    }))

    return result
  },
}
