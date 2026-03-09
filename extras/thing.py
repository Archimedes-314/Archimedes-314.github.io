solutions = []

for number in range(1000, 9999):
    reversed_number = int(str(number)[::-1])

    if number == 4 * reversed_number:
        solutions.append(number)

print(f"Solutions: {solutions}")