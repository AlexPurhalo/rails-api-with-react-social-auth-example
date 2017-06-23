### Tutorial
#### I. Rails API preparing
`$ rails new rails-api-with-react-socail-auth --api -T`
<br/>
```
# app/controllers/application_controller.rb
...
def test_action
  render json: { title: "Hello from Rails API :)"}
end
...
```
```
# config/routes.rb
...
get '/test_route', to: 'application#test_action', as: :test_route
...
```
#### II. Client data generating 
`$ npm install -g create-react-app`
<br/>
`$ create-react-app client && cd client && npm start`
#### III. Setting up of server and client sides
```
# client/package.json
...
  "proxy": "http://localhost:3001",
...
```

`$ touch Procfile.dev`
```
# Procfile
web: cd client && PORT=3000 npm start
api: PORT=3001 && bundle exec rails s
```
```
# Gemfile
...
group :development do
...
  gem 'foreman'
...
end
...
```
`$ gem install foreman && foreman start -f Procfile.dev`
<br/>
`$ touch lib/tasks/start.rake`
```
# lib/tasks/start.rake

namespace :start do
  task :development do
    exec 'foreman start -f Procfile.dev'
  end
end

desc 'Start development server'
task :start => 'start:development'
```
`$ rake start`
``
#### Fetching data from the server
```
// client/src/App.js
import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = { message: null };
	}

	componentDidMount() {
		const testUrl = window.location.href;

		axios.get(`${testUrl}/test_route`)
			.then(res => this.setState({ message: res.data.title }))
	}

  render() {
		const { message } = this.state;
    return <div className="App">{ message ? message : 'loading...' }</div>;
  }
}

```
#### Connection to production (Heroku)
```
# Gemfile
...
group :development, :test do
	...
	gem 'sqlite3'
end
...
group :production do
	gem 'pg'
end
...
```
`$ bundle install` <br/>
```
# config/database.yml
default: &default
  adapter: sqlite3
  pool: 5
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

test:
  <<: *default
  database: db/test.sqlite3

production:
  url: <%= ENV['DATABASE_URL'] %>
```
`$ touch package.json`
```
// package.json

{
  "name": "list-of-ingredients",
  "engines": {
    "node": "6.3.1"
  },
  "scripts": {
    "build": "cd client && npm install && npm run build && cd ..",
    "deploy": "cp -a client/build/. public/",
    "postinstall": "npm run build && npm run deploy && echo 'Client built!'"
  }
}
```
`$ touch Procfile`
```
# lib/tasks/start.rake
namespace :start do
  ...
  desc 'Start production server'
  task :production do
    exec 'NPM_CONFIG_PRODUCTION=true npm run postinstall && foreman start'
  end
end
...
```
`$ heroku apps:create && heroku buildpacks:add heroku/nodejs --index 1 && heroku buildpacks:add heroku/ruby --index 2`
```
# Procfile

web: bundle exec rails s
```
`$ heroku config:set NPM_CONFIG_PRODUCTION=false`
`$ git add . && git commit -vam "connection-client-side-for-app" && git push heroku master`
