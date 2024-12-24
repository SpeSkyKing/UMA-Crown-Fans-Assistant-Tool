<!doctype html>
<html class="h-full" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Laravel') }}</title>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/ts/app.tsx'])
    
</head>
<body class="h-full">
<div id="app" class="h-full"></div>
</body>
</html>
