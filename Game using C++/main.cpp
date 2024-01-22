#include<iostream>
#include<conio.h>
#include<dos.h>
#include<stdlib.h>
#include <windows.h>
#include <time.h>

#define SCREEN_WIDTH 100
#define SCREEN_HEIGHT 28
#define BRD_WIDTH 70
#define GAP_Size 7
#define PIPE_DIF 45

using namespace std;


HANDLE console = GetStdHandle(STD_OUTPUT_HANDLE);
COORD CursorPos;

int pipePos[2];
int gap[2];
int pipeFlag[2];
char bird[2][6] = { '/','-','-','o','\\' ,' ',
					'|','_','_','_',' ','>' };
int birdPos = 6;
int Score = 0;

void SetPos(int x, int y)
{
	CursorPos.X = x;
	CursorPos.Y = y;
	SetConsoleCursorPosition(console, CursorPos);
}

void setcursor(int Size)
{


	CONSOLE_CURSOR_INFO locCursor;
	locCursor.bVisible = false;
	locCursor.dwSize = Size;
	SetConsoleCursorInfo(console,&locCursor);
}


void drawBorder(){

	for(int i=1; i<SCREEN_WIDTH; i++){
		SetPos(i,0); cout<<"*";
		SetPos(i,SCREEN_HEIGHT); cout<<"*";
	}

	for(int i=0; i<SCREEN_HEIGHT; i++){

		SetPos(0,i); cout<<"|";
        SetPos(SCREEN_WIDTH,i); cout<<"|";
        SetPos(BRD_WIDTH,i);cout<<"|";
	}

}
void genPipe(int ind){
	gap[ind] = 3 + rand()%14;
}
void drawPipe(int ind){
	if( pipeFlag[ind] == true ){
            SetConsoleTextAttribute(console,10);
		for(int i=0; i<gap[ind]; i++){
			SetPos(BRD_WIDTH-pipePos[ind],i+1); cout<<"| |";

		}
        for(int i=gap[ind]+GAP_Size; i<SCREEN_HEIGHT-1; i++){
			SetPos(BRD_WIDTH-pipePos[ind],i+1); cout<<"| |";


		}
	}
}
void erasePipe(int ind){
	if( pipeFlag[ind] == true ){
		for(int i=0; i<gap[ind]; i++){
			SetPos(BRD_WIDTH-pipePos[ind],i+1); cout<<"   ";
		}
		for(int i=gap[ind]+GAP_Size; i<SCREEN_HEIGHT-1; i++){
			SetPos(BRD_WIDTH-pipePos[ind],i+1); cout<<"   ";
		}
	}
}

void drawBird(){
	for(int i=0; i<2; i++){
		for(int j=0; j<6; j++){
                SetConsoleTextAttribute(console,6);
			SetPos(j+2,i+birdPos); cout<<bird[i][j];

		}

	}
}
void eraseBird(){
	for(int i=0; i<2; i++){
		for(int j=0; j<6; j++){
			SetPos(j+2,i+birdPos); cout<<" ";
		}
	}
}

int collision(){

if( pipePos[0] >= 61 ){
		if( birdPos<gap[0] || birdPos >gap[0]+GAP_Size ){
			return 1;
		}
}

	return 0;
}

void gameover(){
    system("cls");
    system("Color 04");
	cout<<endl<<endl<<endl;
	cout<<"\t\t\t\t--------------------------"<<endl;
	cout<<"\t\t\t\t-------- Game Over -------"<<endl;
	cout<<"\t\t\t\t--------------------------"<<endl<<endl;
	cout<<"\t\t\t\tPress any key to go back to menu.";
	getch();
}
void updateScore(){
	 SetConsoleTextAttribute(console,4);
	SetPos(BRD_WIDTH + 7, 5);cout<<"Score: "<<Score<<endl;

}

void instructions(){

	system("cls");
	cout<<"Instructions";
	cout<<"\n----------------";
	cout<<"\n Press spacebar to make bird fly";
	cout<<"\n Tap anywhere on screen to pause/continue the game ";
	cout<<"\n\nPress any key to go back to menu";
	getch();
}

void play(){

	birdPos = 6;
	Score = 0;
	pipeFlag[0] = 1;
	pipeFlag[1] = 0;
	pipePos[0] = pipePos[1] = 4;
    system("cls");
    system("Color 09 ");
	drawBorder();
	genPipe(0);


    SetPos(10, 5); cout<<"Press any key to start";
	SetPos(BRD_WIDTH + 5, 2); cout<<"WELCOME TO THIS GAME";
	SetConsoleTextAttribute(console,4);
	SetPos(BRD_WIDTH + 6, 4); cout<<"----------";
	SetPos(BRD_WIDTH + 6, 6); cout<<"----------";
    SetConsoleTextAttribute(console,9);
	SetPos(BRD_WIDTH + 7, 12); cout<<"Control ";
	SetPos(BRD_WIDTH + 7, 13); cout<<"-------- ";
	SetPos(BRD_WIDTH + 2, 14); cout<<" Spacebar = jump";
    SetPos(BRD_WIDTH + 2, 15); cout<<"Pause=Tap on screen ";
    SetPos(BRD_WIDTH + 2, 16); cout<<"Continue=Press any key ";
    updateScore();
	getch();
	SetPos(10, 5);cout<<"                      ";

	while(1){

		if(kbhit()){
			char ch = getch();
			if(ch==32){
				if( birdPos > 3 )
					birdPos-=3;
			}
			if(ch==27){
				break;
			}
		}

		drawBird();
		drawPipe(0);
    	drawPipe(1);
		if( collision() == 1 ){
			gameover();
			return;
		}
		Sleep(100);
		eraseBird();
		erasePipe(0);
		erasePipe(1);
		birdPos += 1;

		if( birdPos > SCREEN_HEIGHT - 2 ){
			gameover();
			return;
		}

		if( pipeFlag[0] == 1 )
			pipePos[0] += 2;

		if( pipeFlag[1] == 1 )
			pipePos[1] += 2;

		if( pipePos[0] >= 40 && pipePos[0] < 42 ){
			pipeFlag[1] = 1;
			pipePos[1] = 4;
			genPipe(1);
		}
		if( pipePos[0] > 68 ){
			Score++;
			updateScore();
			pipeFlag[1] = 0;
			pipePos[0] = pipePos[1];
			gap[0] = gap[1];
		}

	}

}



int main()
{


	setcursor(1);
	srand(time(0));



	do{
		system("cls");
		SetPos(10,5); cout<<"\t\t\t ---------------------------------- ";
		SetPos(10,6); cout<<"\t\t\t |      WELCOME TO THIS GAME      | ";
		SetPos(10,7); cout<<"\t\t\t ----------------------------------";
		SetPos(10,9); cout<<"\t\t\t 1. Start Game";
		SetPos(10,10); cout<<"\t\t\t 2. Instructions";
		SetPos(10,11); cout<<"\t\t\t 3. Quit";
		SetPos(10,13); cout<<"\t\t\t Select option: ";
		system("Color 04");
		char ch=getche();

		if( ch=='1') play();
		else if( ch=='2') instructions();
		else if( ch=='3') exit(0);


	}while(1);

	return 0;
}
