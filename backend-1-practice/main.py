from dataclasses import dataclass

@dataclass
class Master:
    master_id: int
    name: str


@dataclass
class Service:
    service_id: int
    name: str


masters = [
    Master(master_id=1, name="Алексей"),
    Master(master_id=2, name="Дмитрий"),
]

services = [
    Service(service_id=1, name="Мужская стрижка"),
    Service(service_id=2, name="Стрижка бороды"),
]


def get_master(master_id: int) -> Master | None:
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    for service in services:
        if service.service_id == service_id:
            return service
    return None


#ЗАДАНИЕ 1

@dataclass
class Appointment:
    id: int
    client_name: str
    master_id: int
    service_id: int
    time: str


appointments: list[Appointment] = []


def _is_valid_time(time: str) -> bool:
    """Проверка формата времени ЧЧ:ММ."""
    try:
        hours, minutes = map(int, time.split(":"))
        return 0 <= hours <= 23 and 0 <= minutes <= 59
    except (ValueError, AttributeError):
        return False


def _is_within_working_hours(time: str) -> bool:
    """Задание 2: проверка, что время в пределах 08:00–20:00."""
    if not _is_valid_time(time):
        return False
    hours = int(time.split(":")[0])
    return 8 <= hours < 20


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    master = get_master(master_id)
    service = get_service(service_id)

    # Все поля должны быть заполнены
    if not client_name or master is None or service is None or not time:
        return None

    # Задание 2: проверка рабочего времени
    if not _is_within_working_hours(time):
        return None

    appointment = Appointment(
        id=len(appointments) + 1,
        client_name=client_name,
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


#ПРОВЕРКА

if __name__ == "__main__":
    # Задание 1: две корректные записи
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    # Задание 1: некорректная запись (пустое имя)
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print(len(appointments))  # Ожидаемо: 2

    # Задание 2: запись вне рабочего времени
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print(len(appointments))  # Ожидаемо: 2