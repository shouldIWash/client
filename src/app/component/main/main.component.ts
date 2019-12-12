import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  temp: string;
  city: string;
  weather: string;
  dayWeather: any;
  dayAdded: any;
  rainyDays: number;
  isNight: boolean;

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.isNight = new Date().getHours() > 18;
    this.rainyDays = 0;
    this.httpClient.get('https://api.openweathermap.org/data/2.5/weather?q=henderson&appId=2715035eb8c541155ff7f2d93a136646&units=imperial')
      .subscribe(
        (response: any) => {
          const {
            main: {
              temp
            },
            name,
            weather: [{main}]
          } = response;

          this.temp = Math.round(temp).toString();
          this.city = name;
          this.weather = main;
        }
      );

    this.httpClient.get('https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=2715035eb8c541155ff7f2d93a136646&q=Las vegas')
      .subscribe(
        (response: any) => {
          this.dayAdded = [];
          this.dayWeather = [];

          response.list.forEach(d => {
            const date = new Date(d.dt * 1000);
            const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            const day = days[date.getDay()];

            const {
              main: {
                temp
              },
              weather: [{main}]
            } = d;

            if (main === 'Rain') {
              this.rainyDays++;
            }

            if (!this.dayAdded.includes(day)) {
              this.dayAdded.push(day);

              this.dayWeather.push({
                dayOfWeek: day,
                temp: Math.round(temp),
                weather: main
              });
            }
          });
        }
      );
  }

}
