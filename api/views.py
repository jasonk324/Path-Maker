from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    grid = []
    for col in range(0, 50):
        grid.append([])
        for row in range(0, 97):
            grid[col].append(0)

    return Response(grid)

