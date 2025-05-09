<h1>Tests Creator</h1>

###

<p>This is my pet-project to show my skills in Tailwind, CSS, JS, React.js, Node.js.</p>

###

<h2>Tech Stack</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="40" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="40" alt="css3 logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=tailwind" height="40" alt="tailwindcss logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=js" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=react" height="40" alt="react logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://skillicons.dev/icons?i=express" height="40" alt="express logo"  />
</div>

###

<h2>Setup</h2>

###

<p>Firstly, type in the console: <pre><code>npm i</code></pre></p>

###

<h3>Tokens</h3>

###

<ul>
  <li>Go to a directory with module 'CommonJS' and type in the console twice: <pre><code>require('crypto').randomBytes(64).toString('hex')</code></pre></li>
  <li>go to this project's directory and create a .env file in the root and paste:
    <pre>
      <code>ACCESS_TOKEN_SECRET="first code"</code>
      <code>REFRESH_TOKEN_SECRET="second code"</code>
      <code>DATABASE_URI=</code>
      <code>NODE_ENV=production</code>
      <code>PORT=3500</code>
    </pre>
  </li>
</ul>

###

<h3>Database</h3>

###

<ul>
  <li>Go to <a href="https://www.mongodb.com/">MongoDB</a></li>
  <li>Create an account or sign in</li>
  <li>Create a new project)</li>
  <li>Create a cluster</li>
  <li>Then follow the instuctions and copy the URI</li>
  <li>Go to your .env and paste in the URI to <pre><code>DATABASE_URI</code></pre></li>
  <li>Replace the <password> and <username> with your data</li>
</ul>

###

<h3>Prepare app for production</h3>

###

<ul>
  <li>Create a file called <pre><code>.env.production</code></pre></li>
  <li>Paste in this: <pre><code>REACT_APP_API_URL=http://localhost:3500</code></pre></li>
  <li>Paste in the console: <pre><code>npm run build</code></pre></li>
</ul>

###

<h2>Start</h2>

###

<pre>
  <code>
    node server
  </code>
</pre>

###

<p>Wait till the server is started</p>

###

<p>Finally, open your browser and the <a href="http://localhost:3500">localhost with port 3500</a></p>

###
