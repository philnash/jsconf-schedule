# JSConf (and others) schedule

Hey there! [JSConfEU](http://jsconf.eu) is a great conference but sadly(!) the schedule is all wrapped up in a [Google Spreadsheet](http://2015.jsconf.eu/news/2015/09/14/talk-schedule/).

This is an offline capable web application that has the full schedule for JSConfEU, Reject.js and CSSConfEU. It uses Service Workers where supported and Application Cache as a fallback.

It is available here: https://jsconf-schedule.herokuapp.com/

(Thanks Heroku for https!)

## Contributing

Pull requests are welcome if I have got something wrong. I apologise now, as the server requires Ruby to run. Clone the repository, then run:

```shell
$ bundle install
$ bundle exec thin start -p PORT_NUMBER
```

Watch out for the caching though, it's quite aggressive!

## Contributors

Thanks to [Daniel Gooß](https://github.com/Dangoo) for updating the design!
