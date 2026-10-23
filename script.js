(function(){
var WA="923354515968",MAIL="muhammadashhal16@gmail.com",DC="karma_4u";
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
var root=document.documentElement,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
/* theme */
try{var t=localStorage.getItem("th");if(t)root.setAttribute("data-theme",t)}catch(e){}
$("#tg").onclick=function(){var cur=root.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");var n=cur==="light"?"dark":"light";root.setAttribute("data-theme",n);try{localStorage.setItem("th",n)}catch(e){}};
/* mobile menu */
var nav=$("nav"),mb=$("#mb");
mb.onclick=function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o);mb.textContent=o?"✕":"☰"};
$$(".links a").forEach(function(a){a.addEventListener("click",function(){nav.classList.remove("open");mb.setAttribute("aria-expanded","false");mb.textContent="☰"})});
/* cursor glow + 3D tilt (desktop only) */
if(fine){
  var g=$("#glow");addEventListener("pointermove",function(e){g.style.left=e.clientX+"px";g.style.top=e.clientY+"px"},{passive:true});
  $$(".tilt").forEach(function(c){c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform="perspective(700px) rotateY("+x*10+"deg) rotateX("+-y*10+"deg) translateY(-4px)"});c.addEventListener("pointerleave",function(){c.style.transform=""})});
}
/* typing */
var w=["Graphic Designer","3D Visualizer","Front-End Developer","Brand Builder"],wi=0,ci=0,del=false,el=$("#type");
(function tick(){var s=w[wi];ci+=del?-1:1;el.textContent=s.slice(0,ci);var d=del?40:90;if(!del&&ci===s.length){del=true;d=1400}else if(del&&ci===0){del=false;wi=(wi+1)%w.length;d=300}setTimeout(tick,d)})();
/* reveal + bars */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");$$(".fill",e.target).forEach(function(f){f.style.width=f.dataset.w+"%"});io.unobserve(e.target)}})},{threshold:.1});
$$(".rv").forEach(function(x){io.observe(x)});
/* counters */
$$("[data-n]").forEach(function(b){var n=+b.dataset.n,i=0,st=setInterval(function(){i++;b.textContent=i+"+";if(i>=n)clearInterval(st)},1400/n)});
/* portfolio filter */
$$("#flt button").forEach(function(b){b.onclick=function(){$$("#flt button").forEach(function(x){x.classList.remove("on")});b.classList.add("on");$$("#wk .work").forEach(function(k){k.classList.toggle("hide",b.dataset.f!=="all"&&k.dataset.c!==b.dataset.f)})}});
/* active nav link */
var ls=$$(".links a[href^='#']"),tk=false;
addEventListener("scroll",function(){if(tk)return;tk=true;requestAnimationFrame(function(){var y=scrollY+140;ls.forEach(function(a){var s=$(a.getAttribute("href"));a.classList.toggle("on",!!s&&s.offsetTop<=y&&s.offsetTop+s.offsetHeight>y)});tk=false})},{passive:true});
/* discord copy */
function say(m){var x=$("#ts");x.textContent=m;x.classList.add("show");setTimeout(function(){x.classList.remove("show")},2200)}
function cp(e){e.preventDefault();(navigator.clipboard?navigator.clipboard.writeText(DC):Promise.reject()).then(function(){say("Discord username copied: "+DC)}).catch(function(){say("Discord: "+DC)})}
$("#dc").onclick=cp;$("#dc2").onclick=cp;
/* contact form */
$("#em").onclick=function(){var f=$("#cf");if(!f.reportValidity())return;var b="Hi Ashhal,\n\nI’m "+$("#nm").value+".\nService: "+$("#sv").value+"\n\n"+$("#ms").value;location.href="mailto:"+MAIL+"?subject="+encodeURIComponent("Project enquiry: "+$("#sv").value)+"&body="+encodeURIComponent(b)};
$("#cf").onsubmit=function(e){e.preventDefault();var m="Hi Ashhal, I’m "+$("#nm").value+". Service: "+$("#sv").value+". "+$("#ms").value;open("https://wa.me/"+WA+"?text="+encodeURIComponent(m),"_blank")};
})();
