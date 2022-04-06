@echo off

echo Installing server and clientside dependencies.
pushd .\server-client
call npm install
popd
echo Server and clientside dependency installation finished.

echo Compiling serverside and clientside...
pushd .\server-client
call npm run build
popd
echo Serverside and clientside compile finished.

echo Everything should be installed by now.
pause