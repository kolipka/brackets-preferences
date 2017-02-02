@echo off
rem This will bind development version to Brackets extension folder
rem -u will just remove extension

set CUR=%~dp0..
set EXT=%APPDATA%\Brackets\extensions\user\brackets-preferences

if exist %EXT% (
  echo Folder exist! Removing...
  rmdir /q/s %EXT%
)

if [%1] NEQ [-u] (
  echo Making junction...
  mklink /j %EXT% %CUR%
)
