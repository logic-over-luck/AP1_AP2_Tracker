import re
class Ed:
    def __init__(self, p): self.p=p; self.s=open(p,encoding='utf8').read()
    def rep(self,a,b):
        assert self.s.count(a)==1, (self.s.count(a), a[:90])
        self.s=self.s.replace(a,b)
    def drop_k(self,label):
        m=re.search(r'L\.k\("'+label+r'".*?\]\)\n', self.s, re.S); assert m, label
        self.s=self.s[:m.start()]+self.s[m.end():]
    def save(self): open(self.p,'w',encoding='utf8').write(self.s)
