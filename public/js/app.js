document.body.className = 'js';

var dayLinks = document.querySelectorAll('nav a'),
    dayLists = document.querySelectorAll('.day'),
    today = new Date(),
    days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    i, j, len, day, hour, todayList, hourToView;

function addClass(element, klass) {
  element.className += ' ' + klass;
}
function removeClass(element, klass){
  element.className = element.className.replace(klass, '');
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

day = today.getHours() < 6 ? days[(today.getDay() + 6) % 7] : days[today.getDay()];
hour = today.getHours();
removeClass(document.querySelector('nav .active'), 'active');
addClass(document.getElementById('nav_' + day), 'active');
removeClass(document.querySelector('.day.active'), 'active');
todayList = document.getElementById(day)
addClass(todayList, 'active');
hourToView = todayList.querySelector('.hour_' + hour)
if(hourToView !== null) {
  hourToView.scrollIntoView();
  window.scrollBy(0,-66);
}
