import request from "request";
import * as fs from "fs";
import { simpleParser } from "mailparser";
import { exec } from "child_process";
import { VideoLibrary } from "./schema";
import fetch from "node-fetch";
import https from "https";

/**
 * @class MailmanCron
 */
export class MailmanCron {
  /**
   * Initializing Constructor to initialize the cron
  */
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
                      const body = `{
                        getUsersBy(name: "${mail.from.value[0].name}") {
                          rhatUUID,
                          name
                        }
                      }`;
                      const headers = {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.API_KEY}`,
                      };
                      const agent = new https.Agent({
                        rejectUnauthorized: false,
                      });
                    
                      const options = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({query: body}),
                        agent: agent,
                      };
              
                      fetch(`${process.env.API_GATEWAY_URL}`, options)
                      .then( (res: any) => res.json() )
                      .then( (res: any) => {
                        const videoData = new VideoLibrary({
                          "title": mail.subject,
                          "description": mail.text,
                          "tags": [ "mailman-import" ],
                          "mailingLists": [process.env.EMAIL],
                          "createdOn": mail.date,
                          "createdBy": res.data?.getUsersBy ? res.data?.getUsersBy[0].rhatUUID : null,
                          "fileID": Math.random().toString(36).slice(2),
                        });
                        videoData.save();
                      } )
                      .catch(console.error);
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
