void function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
}(window,document,'script','//www.google-analytics.com/analytics.js','ga')

ga('create', 'UA-33952776-3', 'greeklaw.github.io')
ga('require', 'displayfeatures')
ga('send', 'pageview')

document.body.addEventListener('click',
function(e){
e.target.id ? ga('send', 'event', 'button', 'click', e.target.id, {'nonInteraction': 1, 'page': location.pathname}:
              void(null)
})
