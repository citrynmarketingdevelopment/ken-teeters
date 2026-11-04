import { fields, areas } from '@/app/application/fields';
import { isSameOriginRequest } from '@/lib/request-origin';
export const runtime = 'nodejs';
const reply=(message:string,status:number)=>Response.json({message},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 if(!isSameOriginRequest(request)) return reply('Please submit from this website.',403);
 if(!request.headers.get('content-type')?.startsWith('application/json')) return reply('Invalid request.',415);
 const reader=request.body?.getReader(); if(!reader)return reply('Invalid request.',400);
 let size=0; const chunks:Uint8Array[]=[]; try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20000){await reader.cancel();return reply('Application is too large.',413)}chunks.push(value)}}catch{return reply('Could not read the application.',400)}
 let raw:Record<string,unknown>;try{raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error()}catch{return reply('Invalid application.',400)}
 const values:Record<string,string>={}; for(const [name,,type,required] of fields){const value=raw[name];if(typeof value!=='string'&&value!==undefined)return reply('Please check your answers.',400);const s=(value??'').trim();if((required&&!s)||s.length>(type==='textarea'?3000:250))return reply('Please complete the required fields.',400);values[name]=s}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)||/[\r\n]/.test(values.email))return reply('Please enter a valid email address.',400);
 if(values.areas.split(', ').some(x=>!areas.includes(x as typeof areas[number])))return reply('Please check the selected areas.',400);
 for(const name of ['retired','disabled','discharge','dd214'])if(values[name]&&!['Yes','No'].includes(values[name]))return reply('Please check your answers.',400);
 if(values.housing&&!['Rent','Own'].includes(values.housing))return reply('Please check your answers.',400);
 const apiKey=process.env.SMTP_API,channel=process.env.SMTP_CHANNEL;if(!apiKey||!channel)return reply('Online applications are temporarily unavailable. Please download the PDF.',503);
 try{const response=await fetch('https://api.smtp.com/v4/messages',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json','X-SMTPCOM-API':apiKey},body:JSON.stringify({channel,recipients:{to:[{address:'citryn.contactforms@gmail.com'}]},originator:{from:{name:'Kenneth Teeters Foundation',address:'contactforms@citryn.com'},reply_to:{address:values.email}},subject:'Veteran assistance application',body:{parts:[{type:'text/plain',charset:'UTF-8',content:fields.map(([key,label])=>`${label}: ${values[key] || 'Not provided'}`).join('\n\n')}]}}),signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('rejected');const result=await response.json();if(result.status!=='success'||!(result.data?.msg_id||/^accepted,\s*msg_id:\s*[a-zA-Z0-9][a-zA-Z0-9._-]*\s*$/i.test(result.data?.message??'')))throw Error('not accepted');return reply('Your application has been submitted. Thank you.',200)}catch{console.error('Application email delivery failed.');return reply('We could not confirm your application was sent. Please try again or download the PDF.',502)}
}
