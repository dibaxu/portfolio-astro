import { type FormEvent, useState } from "react"; 
import { useForm, ValidationError } from '@formspree/react';

export default function Form() {
  const [state, handleSubmit] = useForm("xjvnkyjj");  
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  if (state.succeeded) {
    setTimeout(() => {
    setEmail("");
    setSubject("");
    setMessage("");
    }, 2000);
  }
 

  return (
    <form onSubmit={handleSubmit} className='space-y-8' method='post'>      
      <div>
      <label
        htmlFor='email'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-300'
        >Your email</label>
      <input
        type='email'
        id='email'
        name='email'
        value={email || ""}
        onChange={(e) => setEmail(e.target.value)}
        className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
        placeholder='name@email.com'
        required
      />
      <ValidationError 
        prefix="Email" 
        field="email"
        errors={state.errors}
      />
    </div>
    <div>
      <label
        htmlFor='subject'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-300'
        >Subject</label>
      <input
        type='text'
        id='subject'
        name='subject'
        value={subject || ""}
        onChange={(e) => setSubject(e.target.value)}
        className='block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light'
        placeholder='Let me know how I can help you'
        required
      />
      <ValidationError
      prefix="Subject"
      field="subject"
      errors={state.errors}
      />
    </div>      
    <div className='sm:col-span-2'>
      <label
        htmlFor='message'
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-zinc-300'
        >Your message</label>
      <textarea
        id='message'
        name='message'
        rows={6}
        value={message || ""}
        onChange={(e) => setMessage(e.target.value)}
        className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary'
        placeholder='Leave a comment...'></textarea>
        <ValidationError 
        prefix="Message" 
        field="message"
        errors={state.errors}
      />
    </div>
    <button
      type='submit'
      disabled={state.submitting}
      className='py-3 px-5 text-sm font-medium text-center rounded-lg bg-primary/80 sm:w-fit hover:bg-primary focus:ring-4 focus:outline-none focus:ring-secondary dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:focus:ring-secondary'>
       {state.submitting ? <span className="flex">
         <svg className="animate-spin  h-5 w-5 mr-3 ..." viewBox="0 0 24 24"><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-loader-3" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 0 0 9 9a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9" /><path d="M17 12a5 5 0 1 0 -5 5" /></svg></svg>
         Sending...
       </span> : "Send message"}
      </button>
      { state.succeeded && <p className=" text-green-600">I will contact you soon.</p> }
    </form>
  );
}

