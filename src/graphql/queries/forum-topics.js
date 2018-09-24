import fetch from 'node-fetch'

export default async (root, {id,}, context) => {
  const {topics,} = await fetch(`https://forums.openusercss.org/api/category/${id}`)
  .then((res) => res.json())

  const result = topics.map((topic) => ({
    'title':   topic.title,
    'url':     `https://forums.openusercss.org/topic/${topic.slug}`,
    'created': topic.timestampISO,
    'author':  topic.user.username,
  }))

  return result
}
