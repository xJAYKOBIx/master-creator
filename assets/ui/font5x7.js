// A 5 × 7 capitals-only pixel font for screens and signage: captions, lower thirds, tickers, channel numbers, NO SIGNAL. Each glyph is
// seven rows of five bits, written as hex pairs. Every character is six pixels wide, gap included.
const G={
 A:'0E11111F111111',B:'1E11111E11111E',C:'0E11101010110E',D:'1E11111111111E',E:'1F10101E10101F',F:'1F10101E101010',G:'0E11101711110F',
 H:'1111111F111111',I:'0E04040404040E',J:'0702020202120C',K:'11121418141211',L:'1010101010101F',M:'111B1515111111',N:'11111915131111',
 O:'0E11111111110E',P:'1E11111E101010',Q:'0E11111115120D',R:'1E11111E141211',S:'0F10100E01011E',T:'1F040404040404',U:'1111111111110E',
 V:'11111111110A04',W:'1111111515150A',X:'11110A040A1111',Y:'11110A04040404',Z:'1F01020408101F',
 0:'0E11131519110E',1:'040C040404040E',2:'0E11010204081F',3:'1F02040201110E',4:'02060A121F0202',
 5:'1F101E0101110E',6:'0608101E11110E',7:'1F010204080808',8:'0E11110E11110E',9:'0E11110F01020C',
 ' ':'00000000000000','.':'00000000000C0C',',':'000000000C0408',':':'000C0C000C0C00',"'":'0C040800000000','-':'0000000E000000',
 '—':'0000001F000000','!':'04040404040004','?':'0E110102040004','·':'0000040E040000','[':'0E08080808080E',']':'0E02020202020E',
 '/':'01010204081010','&':'0C12140815120D'};
export const ADVANCE=6,HEIGHT=7;
export const width=s=>s.length?s.length*ADVANCE-1:0;
// Draw text with its top-left at (x, y). Unknown characters are left blank.
export function text(c,s,x,y,color){c.fillStyle=color;x=Math.round(x);y=Math.round(y);
 for(const ch of s){const g=G[ch];if(g)for(let r=0;r<7;r++){const bits=parseInt(g.substr(r*2,2),16);for(let b=0;b<5;b++)if(bits&(16>>b))c.fillRect(x+b,y+r,1,1);}x+=ADVANCE;}}
export const GLYPHS=G;
