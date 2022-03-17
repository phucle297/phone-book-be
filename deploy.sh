rm -rf phone-book-be
git clone https://github.com/phucle297/phone-book-be.git
cp .env phone-book-be
cp phone-book.pem phone-book-be/src/models/
cp ca_bundle.crt phone-book-be/src/
cp certificate.crt phone-book-be/src/
cp private.key phone-book-be/src/
cd phone-book-be
npm install
killall screen
killall -9 node
screen
# npm run dev