import request from "request";
import * as fs from "fs";
import { simpleParser } from "mailparser";
import { exec } from "child_process";
import { VideoLibrary } from "./schema";

/**
 * @class MailmanCron
 */
export class MailmanCron {
  io: any;
  /**
   * Initializing Constructor to initialize the cron
  */
  constructor() {
  }
  public getEmailArchives() {
    const downloadAndProcessArchive =  (url: any, fileName: any, callback: any) => {
      request.head(url, (err: any, response: any, body: any) =>  {
        request(url).pipe(fs.createWriteStream(`/tmp/${fileName}`)).on("close", callback);
      });
    };
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const yearParams: string[] = [`${currentYear}-${months[currentMonth]}`];
    if( currentMonth === 0 ) {
      yearParams.push(`${currentYear - 1}-${months[11]}`);
    }
    else {
      yearParams.push(`${currentYear}-${months[currentMonth - 1]}`);
    }
    yearParams.map((yearParam: any) => {
      downloadAndProcessArchive(`${process.env.POST_OFFICE}${yearParam}.txt.gz`, `${yearParam}.txt.gz`, () => {
        console.log(`Downloaded Archive for ${yearParam}`);
        const extractArchive = `
        cd /tmp/ && gunzip ${yearParam}.txt.gz && rm -rf ${yearParam}.txt.gz && mv ${yearParam}.txt ${yearParam}.eml`;
        function callback(error: any, stdout: any, stderr: any) {
          if (error) {
            console.error(`Exec error: ${error}`);
            return;
          }
          if (stdout || stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
          }
        }
        exec(extractArchive, callback);
        fs.readFile(`/tmp/${yearParam}.eml`, `utf8`, (err: any, data: any) => {
          if (data) {
            const formattedData = data.split("\n");
            const emailThreads: any = [];
            let emailContent: any = ``;
            formattedData.map((emailData: any, index: any) => {
              const startRegex = new RegExp(`From .*${process.env.DOMAIN}`, 'g');
              const extractedData = emailData.match(startRegex);
              if (extractedData !== null) {
                if (emailContent !== ``) {
                  emailThreads.push(emailContent);
                }
                emailContent = ``;
                emailContent = emailContent + "\n" + emailData;
              } else if (extractedData === null) {
                emailContent = emailContent + "\n" + emailData;
              }
            });
            emailThreads.map((email: any) => {
              simpleParser(email.trimLeft()).then((mail: any) => {
                const replyRegex = /Re:/g;
                if (mail.subject.match(replyRegex) === null && mail.from.value[0].address !== `${process.env.NOREPLY_EMAIL}`) {
                  VideoLibrary.find({title: mail.subject}).then((dbVideo: any) => {
                    if (dbVideo.length === 0) {
                      const videoData = new VideoLibrary({
                        "title": mail.subject,
                        "description": mail.text,
                        "owner": {
                          "kerberosID": mail.from.value[0].address.substring(0, mail.from.value[0].address.indexOf("@")),
                          "name": mail.from.value[0].name,
                          "email": mail.from.value[0].address,
                        },
                        "tags": [ "mailman-import" ],
                        "mailingLists": [`${process.env.EMAIL}`],
                        "timestamp": {
                          "createdAt": mail.date,
                          "createdBy": {
                            "kerberosID": mail.from.value[0].address.substring(0, mail.from.value[0].address.indexOf("@")),
                            "name": mail.from.value[0].name,
                            "email": mail.from.value[0].address,
                          },
                        },
                        "fileID": Math.random().toString(36).slice(2),
                      });
                      videoData.save();
                    }
                  });
                }
              });
            });
          }
        });
      });
    });
  }
}
