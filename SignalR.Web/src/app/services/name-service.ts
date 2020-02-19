import { Injectable } from '@angular/core';

@Injectable()
export class NameService {
    private names: string[] = ['Rosemary Mccullough', 'Ira Massey', 'Geneva Chan', 'Kristin Frye', 'Betty Larson', 'Kerry Gibson', 'Manuel Mcbride', 'Carey Herrera', 'Tyler Merritt', 'Tyrone Kim', 'Margo Wade', 'Seymour Terry', 'Frankie Downs', 'Trinidad Richmond', 'Nanette Phelps', 'Jack Moon', 'Fern Reyes', 'Bernardo Morris', 'Trevor Acosta', 'Erasmo Zimmerman', 'Stewart Hinton', 'Brett Valencia', 'Maria Spencer', 'Sang Solis', 'Christina Hawkins', 'Sandra Liu', 'Stan Baird', 'Josh Dean', 'Mac Rogers', 'Natasha Wood', 'Becky Anthony', 'Kirk Bolton', 'Elise Mata', 'Darryl Frank', 'Howard Lloyd', 'Duane Mahoney', 'Winifred Serrano', 'Mckinley Maxwell', 'Jeff Schwartz', 'Harland Vaughn', 'Gale Freeman', 'Leigh Hudson', 'Roxanne Dickerson', 'Faye Hahn', 'Muriel Davenport', 'Mose Ochoa', 'Colleen Forbes', 'Sherry Conrad', 'Sonia Winters', 'Rickey Fowler']

    public name: string;
    constructor() {
        this.name = this.getRandomName();
    }

    getRandomName(): string {
        return this.names[this.getRandom(0, this.names.length - 1)];
    }

    private getRandom(lower: number, higher: number): number {
        return Math.floor(Math.random() * higher) + lower;
    }
}