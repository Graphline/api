import secure from 'lib/express/secure'
import routes from 'api/lib/routes'
import cors from 'api/lib/cors'

export const handler = async ({app, config, mode,}) => {
  await secure({app, config, mode,})
  await cors({app, config, mode,})
  await routes({app, config, mode,})

  return {app,}
}
