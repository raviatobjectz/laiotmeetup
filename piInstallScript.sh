sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get remove nodejs -y
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs -y
sudo npm install -g gulp
currDir=`pwd`
cd device
npm install
cd $currDir
cd angular
npm install
cd $currDir
