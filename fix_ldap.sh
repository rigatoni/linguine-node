#Remove nested dependency and update with the newest version
#Ideally once these libraries are upgraded to work with
#ldaps on newer versions of node, this will be eliminated

npm rm ldapjs
npm install git://github.com/mcavage/node-ldapjs.git

npm rm passport-ldapauth 
npm install passport-ldapauth --no-optional
