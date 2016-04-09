# todo-list-nwjs
An implementation of a classic ToDO list application with nwjs. Guide from "NW.js Essentials" by Alessandro Benoit.

## Packaging ```todo-list-nwjs``` for Microsoft Windows
1| Download nw.js, [Windows 64-bit](http://dl.nwjs.io/v0.13.4/nwjs-v0.13.4-win-x64.zip) or [Windows 32- bit](http://dl.nwjs.io/v0.13.4/nwjs-v0.13.4-win-ia32.zip).

2| Extract the folder.

3| Create a copy of the downloaded NW.js folder and rename it to ToDO.

4| Delete unnecessary files such as ```nwjc.exe``` and, only if you are not using
media libraries, ffmpegsumo.dll.

5| Zip the content of the ToDO project folder, the one containing the package.
json file, in an app.zip file (only the content of the folder; if you'd try to zip
the entire folder, it won't work).

6| Rename the zip file to app.nw (if the file extension is hidden, navigate to
View | Folder Options, and remove the flag from the Hide extensions for
known file type option).

7| Copy the ```app.nw``` file into the ```NW.js``` folder that was renamed to ToDO.

8| Open the command prompt inside the folder and type the following
commands:

```prompt
C:\...\ToDO\> copy /b nw.exe+app.nw todo.exe
C:\...\ToDO\> del nw.exe
C:\...\ToDO\> del app.nw
````
>The previous command will merge the ```NW.js``` executable file with ```app.nw``` into a new todo.exe file and delete the older files. If, for any reason, you are using native Node.js/io.js modules, the resulting executable would not be renamed into ```whatever.exe```, but will need to stay as ```nw.exe```.

## Packaging ```todo-list-nwjs``` for Linux.
On Linux, things got even trickier as the concept of standalone applications is not very popular on Linux platforms.

1| Download [Linux 64-bit](http://dl.nwjs.io/v0.13.4/nwjs-v0.13.4-linux-x64.tar.gz), [Linux 32-bit](http://dl.nwjs.io/v0.13.4/nwjs-v0.13.4-linux-ia32.tar.gz).

2| Create a copy of the downloaded NW.js folder and rename it to ToDO.

3| Delete nwjc and libffmpegsumo.so if you don't need media libraries.

4| From within the ToDO project folder, execute the following command to
create a zip file named app.nw:

```
$ zip -r ../app.nw *
```

5| The app.nw file will be placed just outside the project folder; copy it inside
the ToDO folder.

6| Execute the following commands from within the ToDO folder in order to
merge the nw executable with your project archive:

```
$ cat nw app.nw > todo
$ chmod +x todo
$ rm nw
$ rm app.nw
```

7| You are done! If you double-click on the todo file, the application will open
as expected.


