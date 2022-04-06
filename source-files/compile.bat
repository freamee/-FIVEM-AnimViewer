@echo off

echo Compiling serverside and clientside...
pushd .\server-client
call npm run build
popd
echo Serverside and clientside compile finished.

echo Everything is compiled.
pause