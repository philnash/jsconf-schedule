document.body.className = 'js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration){
    console.log(registration);
  }).catch(function(err){ console.log(err); });
}

var dayLinks = document.querySelectorAll('nav a'),
    dayLists = document.querySelectorAll('.day'),
    sessions = document.querySelectorAll('.day a'),
    today = new Date(),
    days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    i, j, len, day, hour, todayList, hourToView, tab;

function addClass(element, klass) {
  element.className += ' ' + klass;
}
function removeClass(element, klass){
  element.className = element.className.replace(klass, '');
}
function hasClass(element, klass){
  return element.className.match(new RegExp(klass));
}

for(i=0, len=dayLinks.length; i < len; i++){
  dayLinks[i].addEventListener('click', function(e){
    var day = document.getElementById(e.target.href.split('#')[1]);
    e.preventDefault();
    for(j=0; j<dayLists.length; j++){
      removeClass(dayLists[j], 'active');
      removeClass(dayLinks[j], 'active');
    }
    e.target.className = 'active';
    day.className = day.className + ' active';
    window.scroll(0,0);
  }, false);
}

for(i=0, len=sessions.length; i < len; i++){
  sessions[i].addEventListener('click', function(e){
    var session = e.currentTarget;
    e.preventDefault();
    if(hasClass(session, 'active')){
      removeClass(session, 'active');
    }else{
      addClass(session, 'active');
    }
  }, false);
}

day = today.getHours() < 6 ? days[(today.getDay() + 6) % 7] : days[today.getDay()];
hour = today.getHours();
tab = document.getElementById('nav_' + day);
if (tab !== null) {
  removeClass(document.querySelector('nav .active'), 'active');
  addClass(tab, 'active');
}
todayList = document.getElementById(day)
if (todayList !== null) {
  removeClass(document.querySelector('.day.active'), 'active');
  addClass(todayList, 'active');
  hourToView = todayList.querySelector('.hour_' + hour)
  if(hourToView !== null) {
    hourToView.scrollIntoView();
    window.scrollBy(0,-66);
  }
}
