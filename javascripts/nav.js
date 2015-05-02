void function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
}(window,document,'script','//www.google-analytics.com/analytics.js','ga')

ga('create', 'UA-33952776-3', 'greeklaw.github.io')
ga('require', 'displayfeatures')
ga('send', 'pageview')

document.addEventListener('click', 
function handle(e){
    var id, For, reference, description

    id        = e.target.id
    For       = e.target.htmlFor
    reference = document.getElementById(For)
    input     = e.target.tagName.toLowerCase() === 'input'

    description = input ? null                                       :
                  id    ? e.target.id                                :
                  For   ? reference.name + ':' + reference.className :
                          null
    description ? ga('send', 'event', decodeURI(location.pathname.match(/.+\/(.+?)\.html?$/)[1]), 'click', description, {'nonInteraction': 1}) :
                  void(null)
})
