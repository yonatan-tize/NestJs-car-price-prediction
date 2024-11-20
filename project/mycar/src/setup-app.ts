import { ValidationPipe } from "@nestjs/common"

export const setupApp = (app: any) => {
    const cookieSession = require("cookie-session")

    app.use(
        cookieSession({
          keys: ['my_session_key']
        })
      )
    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true
        })
    )
}