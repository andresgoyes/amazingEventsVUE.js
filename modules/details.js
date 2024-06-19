const urlApi = "https://aulamindhub.github.io/amazing-api/events.json"
const { createApp } = Vue

const app = createApp({
    data() {
        return {
            event: null
        };
    },
    created() {
        this.fetchEvent();
    },
    methods: {
        fetchEvent() {
            let id = new URL(window.location.href).searchParams.get("id");

            fetch(urlApi)
                .then(response => response.json())
                .then(data => {
                    this.event = data.events.find(event => event._id == id);
                });
        }
    }
}).mount('#app');
