import { MailerService } from '@nestjs-modules/mailer'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueWaiting, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import 'dotenv/config'
import { MAIL_QUEUE, SEND_EMAIL } from 'src/constants'

@Processor(MAIL_QUEUE)
export class MailProcessor {
	private readonly logger = new Logger(this.constructor.name)

	constructor(
		private readonly mailerService: MailerService,
	) { }

	@OnQueueActive()
	onActive(job: Job) {
		this.logger.log(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`)
	}

	@OnQueueCompleted()
	onComplete(job: Job, result: any) {
		this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`)
	}

	@OnQueueFailed()
	onError(job: Job<any>, error: any) {
		this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack)
	}

	@Process(SEND_EMAIL)
	async handleSendEmail(job: Job<{ email: string }>): Promise<any> {
		this.logger.debug(`Sending email to '${job.data.email}'`)
		try {
			const result = await this.mailerService.sendMail({
				to: job.data.email,
				from: process.env.MAIL_FROM,
				subject: 'Testing Nest Mailermodule with template ✔',
				template: 'test', // The `.pug` or `.hbs` extension is appended automatically.
				context: {  // Data to be sent to template engine.
					code: 'cf1a3f828287',
					username: 'John Snow',
				},
			})
			job.progress(100)
			return result

		} catch (error) {
			this.logger.error(`Failed to send confirmation email to '${job.data.email}'`, error.stack)
			throw error
		}
	}
}