rm -rf phone-book-be
git clone https://github.com/phucle297/phone-book-be.git
cp .env phone-book-be
cp phone-book.pem phone-book-be/src/models/
cd phone-book-be
npm install
killall screen
killall -9 node
screen
# npm run dev