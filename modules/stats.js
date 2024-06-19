const urlApi = "https://aulamindhub.github.io/amazing-api/events.json";
const { createApp } = Vue;

createApp({
    data() {
        return {
            events: [],
            currentDate: '',
            upcomingEvents: [],
            pastEvents: []
        };
    },
    created() {
        this.fetchData(urlApi);
    },
    computed: {
        highestAssistance() {
            return this.calculateHighestAssistance(this.pastEvents);
        },
        lowestAssistance() {
            return this.calculateLowestAssistance(this.pastEvents);
        },
        highestCapacity() {
            return this.calculateHighestCapacity(this.events);
        },
        upcomingStats() {
            return this.calculateEventStatistics(this.upcomingEvents);
        },
        pastStats() {
            return this.calculateEventStatistics(this.pastEvents);
        }
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.events = data.events;
                    this.currentDate = data.currentDate;

                    this.upcomingEvents = this.events.filter(event => new Date(event.date) > new Date(this.currentDate));
                    this.pastEvents = this.events.filter(event => new Date(event.date) < new Date(this.currentDate));
                });
        },
        calculateHighestAssistance(events) {
            let highestAssistanceEvent = events.reduce((max, event) => {
                const percentage = (event.assistance / event.capacity) * 100;
                return percentage > max.percentage ? { name: event.name, percentage: percentage.toFixed(2) } : max;
            }, { name: '', percentage: 0 });
            return highestAssistanceEvent;
        },
        calculateLowestAssistance(events) {
            let lowestAssistanceEvent = events.reduce((min, event) => {
                const percentage = (event.assistance / event.capacity) * 100;
                return percentage < min.percentage ? { name: event.name, percentage: percentage.toFixed(2) } : min;
            }, { name: '', percentage: 100 });
            return lowestAssistanceEvent;
        },
        calculateHighestCapacity(events) {
            let highestCapacityEvent = events.reduce((max, event) => {
                return event.capacity > max.capacity ? { name: event.name, capacity: event.capacity } : max;
            }, { name: '', capacity: 0 });
            return highestCapacityEvent;
        },
        calculateEventStatistics(events) {
            const categories = [...new Set(events.map(event => event.category))];
            return categories.map(category => {
                const categoryEvents = events.filter(event => event.category === category);
                const totalRevenues = categoryEvents.reduce((sum, event) => sum + (event.price * (event.assistance || event.estimate)), 0);
                const totalAssistance = categoryEvents.reduce((sum, event) => sum + (event.assistance || event.estimate), 0);
                const totalCapacity = categoryEvents.reduce((sum, event) => sum + event.capacity, 0);
                const percentageAssistance = (totalAssistance / totalCapacity * 100).toFixed(2);
                return {
                    name: category,
                    revenues: totalRevenues,
                    percentage: percentageAssistance
                };
            });
        }
    }
}).mount('#app');