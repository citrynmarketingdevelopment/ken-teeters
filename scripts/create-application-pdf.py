from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
c=canvas.Canvas('public/assets/documents/fillable-application.pdf',pagesize=letter)
c.setTitle('Kenneth Teeters Foundation Application')
def text(x,y,s,size=10,color='#25354a',font='Helvetica'):
 c.setFillColor(HexColor(color)); c.setFont(font,size); c.drawString(x,y,s)
def section(y,title):
 c.setFillColor(HexColor('#142a46')); c.roundRect(36,y-6,540,23,3,fill=1,stroke=0); text(46,y,title,10,'#ffffff','Helvetica-Bold')
def field(name,label,x,y,w,h=22,multi=False):
 text(x,y+h+5,label,9,'#34465b','Helvetica-Bold'); c.acroForm.textfield(name=name,tooltip=label,x=x,y=y,width=w,height=h,borderWidth=0.7,borderColor=HexColor('#a7b5c6'),fillColor=HexColor('#f7f9fc'),textColor=HexColor('#142a46'),fontSize=10,fieldFlags='multiline' if multi else '')
def check(name,label,x,y):
 c.acroForm.checkbox(name=name,tooltip=label,x=x,y=y,size=11,borderWidth=1,borderColor=HexColor('#8b9caf'),fillColor=white,buttonStyle='check'); text(x+16,y+1,label,9)
c.drawImage(ImageReader('public/assets/images/foundation-application-header.webp'),36,709,width=540,height=81,mask='auto')
text(36,700,'Veteran assistance application  |  Complete, save, and return to the foundation.',9)
section(677,'01  PERSONAL INFORMATION')
field('name','Full name',36,626,345); field('sex','Sex (optional)',396,626,180)
field('address','Mailing address',36,574,345); field('housing','Rent or own',396,574,180)
field('service_address','Service address, if different',36,522,540)
field('home_phone','Home phone',36,470,170); field('cell_phone','Cell phone',221,470,170); field('email','Email',406,470,170)
section(440,'02  MILITARY INFORMATION')
field('branch','Service branch',36,389,255); field('years','Service years',306,389,270)
field('retired','Retired? (Yes / No)',36,337,120); field('disabled','Disabled? (Yes / No)',171,337,120); field('discharge','Honorable discharge? (Yes / No)',306,337,130); field('dd214','DD214 available? (Yes / No)',451,337,125)
section(307,'03  REQUEST INFORMATION')
text(36,278,'Requested area of improvement (select all that apply)',9,'#34465b','Helvetica-Bold')
for a in [('exterior','Exterior accessibility',36),('interior','Interior accessibility',165),('kitchen','Kitchen',292),('bathroom','Bathroom',365),('other','Other',456)]: check(a[0],a[1],a[2],255)
field('explanation','Brief explanation of request',36,137,540,86,True)
text(36,112,'Applications are reviewed based on need, hardship, and available funds. Selection is not guaranteed.',8)
text(36,99,'A decision will be provided within 90 days of Board review.',8)
text(36,76,'Mail: Kenneth Teeters Foundation, PO Box 80203, Bakersfield, CA 93380',9,'#142a46','Helvetica-Bold')
text(36,61,'Information is collected solely for applicant selection for foundation services.',8)
c.save()

