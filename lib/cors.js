import cors from 'cors'

export default async ({app,}) => {
  const origin = `${process.env.PROTOCOL}://${process.env.FQDN}:${process.env.PORT},${process.env.FRONTENDS}`
  .split(',')

  console.log(origin)

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
