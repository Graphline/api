import cors from 'cors'

export default async ({app,}) => {
  const origin = `${process.env.PROTOCOL}://${process.env.FQDN}:${process.env.PORT},${process.env.FRONTENDS}`
  .split(',')

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
